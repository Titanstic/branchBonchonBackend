const axios = require("axios");

const abortApiFun = () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    return { controller, timeoutId };
};

const centralHeaders  = {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': 'bonchonerppassword007',
};

const executeCentralMutation = async ( query, variables) => {
    const response = await axios.post(`https://api.erp.bonchon.axra.app/v1/graphql`, {
        query,
        variables
    }, { headers: centralHeaders });

    if(response.data.errors){
        throw new Error(response.data.errors[0].message);
    }

    console.log("[utils] executeCentralMutation: ", JSON.stringify(response.data.data));
    return response.data.data;
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
        }, { headers: branchHeaders });

        if(response.data.errors){
            throw new Error(response.data.errors[0].message);
        }

        console.log("[utils] executeBranchMutation: ", response.data);
        return response.data;
    }catch (e) {
        console.error("[utils] executeBranchMutation Error: ", e.message);
    }
};

module.exports = { executeCentralMutation, executeBranchMutation }