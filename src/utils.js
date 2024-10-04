const axios = require("axios");
const poolQuery = require("../misc/poolQuery");

const abortApiFun = () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    return { controller, timeoutId };
};

const checkOperation =  async (event, tableName) => {
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

const findBranch = async () => {
    const branchData = await poolQuery(`SELECT id,ip_address FROM branches`);
    console.log(`[utils] findBranch :`, branchData.rows);
    return branchData.rows;
};

const centralHeaders  = {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': 'bonchonerppassword007',
};

const executeCentralMutation = async ( query, variables) => {
    const { controller, timeOutId } = abortApiFun();

    try{
        const response = await axios.post(`https://api.erp.bonchon.axra.app/v1/graphql`, {
            query,
            variables
        }, { headers: centralHeaders, signal: controller.signal });
        clearTimeout(timeOutId);

        console.log("[utils] executeCentralMutation: ", JSON.stringify(response.data.data));
        return response.data.data;
    }catch (e) {
        console.error("[utils] executeCentralMutation Error: ", e.message);
    }
};

const branchHeaders  = {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': 'axra_48b59ff9b4139e7d',
};

const executeBranchMutation = async ( query, variables, branch) => {
    try{
        const response = await axios.post(`https://${branch.ip_address}/v1/graphql`, {
            query,
            variables
        }, { headers: branchHeaders});

        console.log("[utils] executeBranchMutation: ", response.data);
        return response.data;
    }catch (e) {
        console.error("[utils] executeBranchMutation Error: ", e.message);
    }
};



const findCurrentBranch = async () => {
    const branchData = await poolQuery(`SELECT id,ip_address FROM branches`);

    if(branchData.rows.length === 0){
        console.error(`[utils] findCurrentBranch Error: No Branch Data`);
        throw new Error("No Branch Data");
    }

    console.log(`[utils] findCurrentBranch : ${JSON.stringify(branchData.rows)}`);
    return branchData.rows[0];
}


module.exports = { abortApiFun, findBranch, checkOperation, executeCentralMutation, executeBranchMutation, findCurrentBranch };