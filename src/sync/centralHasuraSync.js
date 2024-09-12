const express = require("express");
const {fetchWithTimeOut} = require("../../misc/fetchApi");
const {findCurrentBranch, executeCentralMutation, executeBranchMutation} = require("../utils");
const centralHasuraSyncRouter = express.Router();

centralHasuraSyncRouter.post("/", async (req, res) => {
    try{
        const branchData = await findCurrentBranch();

        const {query, variables} = getQueryForSync(branchData);
        const getSyncHistoryData = await executeCentralMutation(query, variables);

        for (const eachSync of getSyncHistoryData) {
            const variable = JSON.parse(eachSync.variables);
            const resposne  = await executeBranchMutation(eachSync.query, variable, branchData);

        }

        res.status(200).json({ success: true, message: "Sync Successfully from cloud"});
    }catch (e){
        console.error(`[centralHasuraSyncRouter] Error:`, e.message);
        res.status(500).json({ success: false, message: e.message });
    }

});

const getQueryForSync = (branchData) => {
    const query = `query MyQuery($branchId: uuid!) {
          sync_history(where: {branch_id: {_eq: $branchId}}) {
            branch_id
            created_at
            id
            query
            updated_at
            variables
          }
        }
        `;
    const variables = { branchId: branchData.id };

    return { query, variables };
}

module.exports = centralHasuraSyncRouter;