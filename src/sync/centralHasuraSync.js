const express = require("express");
const {findCurrentBranch, executeCentralMutation, executeBranchMutation} = require("../utils");
const centralHasuraSyncRouter = express.Router();

centralHasuraSyncRouter.post("/", async (req, res) => {
    try{
        // =>  from cloud to local, data CRUD
        const branchData = await findCurrentBranch();

        const {query, variables} = getQueryForSync(branchData);
        const getSyncHistoryData = await executeCentralMutation(query, variables);

        for (const eachSync of getSyncHistoryData.sync_history) {
            const variable = JSON.parse(eachSync.variables);
            const resposne  = await executeBranchMutation(eachSync.query, variable, branchData);

            if(!resposne.errors){
                const {query, variables} = deleteMutationForSync(eachSync);
                await executeCentralMutation(query, variables);
            }
        }
        // --------------------------------------

        console.log(`[centralHasuraSyncRouter]:`, "Sync Successfully from cloud");
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
};


const deleteMutationForSync = (sync) => {
    const query = `mutation MyMutation($id: uuid!) {
          delete_sync_history_by_pk(id: $id) {
            id
          }
        }
        `;
    const variables = { id: sync.id };

    return { query, variables };
};

module.exports = centralHasuraSyncRouter;