const express = require("express");
const {findCurrentBranch, executeCentralMutation, executeBranchMutation, checkOperation} = require("../utils");
const stockOrderRouter = express.Router();

stockOrderRouter.post("/", async (req, res) => {
    const event = req.body.event;
    const tableName = req.body.table.name;

    try{
        // execute data for each branch
        // const {query, variables} = await checkOperation(event, tableName);
        // for (const eachBranch of branchIpData) {
        //     await executeCentralMutation(query, variables);
        // }

        res.status(200).json({ success: true, message: "Order Successfully from cloud"});
    }catch (e){
        console.error(`[centralHasuraSyncRouter] Error:`, e.message);
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = stockOrderRouter;