const axios = require("axios");
const poolQuery = require("../misc/poolQuery");

const abortApiFun = () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    return { controller, timeoutId };
};

const checkOperation =  async (event, tableName) => {
    let query = "";
    let variables = {};
    let input;

    const operation = event.op;
    if(operation !== "DELETE"){
        input = event.data.new;
        // delete input.sync;
        //
        // if(tableName !== "menu_items"){
        //     delete input.branch_id;
        // }
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
            variables= { input };
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
            variables = { pk: event.data.old[primaryKey], changes: event.data.new };
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


const branchHeaders  = {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': 'axra_48b59ff9b4139e7d',
};

const executeEachBranchMutation = async ( query, variables, branch) => {
    const { controller, timeOutId } = abortApiFun();

    try{
        const response = await axios.post(`https://${branch.ip_address}/v1/graphql`, {
            query,
            variables
        }, { headers: branchHeaders, signal: controller.signal });
        clearTimeout(timeOutId);

        console.log("[utils] executeEachBranchMutation: ", response.data);
        return response.data;
    }catch (e) {
        await poolQuery(`INSERT INTO sync_history(query, variables, branch_id) VALUES($1, $2, $3);`, [query, variables, branch.id]);
        console.log("[utils] executeEachBranchMutation Error: ", e.message);
    }
};


module.exports = { abortApiFun, checkOperation, executeEachBranchMutation };