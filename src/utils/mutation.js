const axios = require("axios");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const abortApiFun = () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    return { controller, timeoutId };
};

const checkOperation =  async (event, tableName, branchId) => {
    let query = "";
    let variables = {};
    let input;

    const operation = event.op;
    if(operation !== "DELETE"){
        input = event.data.new;
    }

    switch (operation){
        case "INSERT":
            query = `
                    mutation InsertData($input: ${tableName}_insert_input!) {
                        insert_${tableName}_one(object: $input) {
                            id
                        }
                    }
                `;
            variables= { input: {...input, branch_id: branchId} };
            break;
        case "UPDATE":
            const primaryKey = 'id';
            query = `
                    mutation UpdateData($pk: uuid!, $changes: ${tableName}_set_input!) {
                        update_${tableName}_by_pk(pk_columns: { ${primaryKey}: $pk }, _set: $changes) {
                            id
                        }
                    }
                `;
            variables = { pk: event.data.old[primaryKey], changes: {...event.data.new, branch_id: branchId } };
            break;
        case "DELETE":
            // Mutation to delete data in local Hasura
            const primaryKey2 = 'id'; // replace with the actual primary key of your table
            query = `
                    mutation DeleteData($pk: uuid!) {
                        delete_${tableName}_by_pk(${primaryKey2}: $pk) {
                            id
                        }
                    }
                `;
            variables = { pk: event.data.old[primaryKey2] };
            break;
    }

    return { query, variables }
};

const centralHeaders  = {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': 'bonchonerppassword007',
};

const executeCentralMutation = async ( query, variables, branch, event) => {
    const { controller, timeOutId } = abortApiFun();
    const columnId = event.data.new ? event.data.new.id : event.data.old.id;

    try{
        const response = await axios.post(`https://api.erp.bonchon.axra.app/v1/graphql`, {
            query,
            variables
        }, { headers: centralHeaders, signal: controller.signal});
        clearTimeout(timeOutId);

        if(response.data.errors){
            await filterSyncTable(query, variables, branch, event, columnId);
        }

        console.log("[utils] executeCentralMutation: ", response.data);
        return response.data;
    }catch (e) {
        // await filterSyncTable(query, variables, branch, event, columnId);

        console.error("[utils] executeCentralMutation Error: ", e.message);
    }
};

// const filterSyncTable = async (query, variables, branch, event, columnId) => {
//     // find data from sync table
//     const getSyncDataBranchId = await poolQuery(`SELECT id,action FROM sync_history WHERE branch_id = $1 and column_id = $2`, [branch.id, columnId]);
//
//     if(getSyncDataBranchId.rowCount !== 0 && event.op === "DELETE"){
//         // if sync data already exists
//         for (const eachSync of getSyncDataBranchId.rows) {
//             await poolQuery(`DELETE FROM sync_history WHERE id = $1;`, [eachSync.id]);
//
//             if (getSyncDataBranchId.rowCount === 1 && eachSync.action === "UPDATE"){
//                 await poolQuery(`INSERT INTO sync_history(query, variables, branch_id, action, column_id) VALUES($1, $2, $3, $4, $5);`, [query, variables, branch.id, event.op, columnId]);
//             }
//         }
//     }else{
//         await poolQuery(`INSERT INTO sync_history(query, variables, branch_id, action, column_id) VALUES($1, $2, $3, $4, $5);`, [query, variables, branch.id, event.op, columnId]);
//     }
// }

module.exports = { delay, checkOperation, executeCentralMutation };