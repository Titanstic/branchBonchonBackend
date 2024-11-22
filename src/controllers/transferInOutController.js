const express = require("express");
const {checkOperationForTransfer, branchDataForTransfer} = require("../utils/transferInOut");
const {executeCentralMutationWithoutEvent} = require("../utils/mutation");
const transferInOutController = express.Router();

transferInOutController.post("/:action/:tableName", async (req, res) => {
    const { tableName, action } = req.params;
    const inputData = req.body.input ?? req.body;

    const {query, variables} = checkOperationForTransfer(tableName, action, inputData);
    console.log(`transferInOutController query: `, query);
    console.log(`transferInOutController variables: `, variables);

    try{
        await executeCentralMutationWithoutEvent(query, variables);

        console.log(`transferInOutController: ${tableName} successfully created`);
        res.status(200).json({ error: 0, message: `${tableName} successfully created` });
    }catch (e) {
        console.error(`transferInOutController error: ${e.message}`);
        res.status(200).json({ error: 1, message: e.message});
    }
});

transferInOutController.post("/branch", async (req, res) => {
    const { branchId } = req.body.input ?? req.body;

    const {query, variables} = branchDataForTransfer(branchId);
    console.log(`transferInOutController branch query: `, query);
    console.log(`transferInOutController branch variables: `, variables);

    try{
        const { branches } = await executeCentralMutationWithoutEvent(query, variables);
        console.log(`transferInOutController: ${JSON.stringify(branches)}`);

        console.log(`transferInOutController: successfully created`);
        res.status(200).json({ error: 0, branchData: branches });
    }catch (e) {
        console.error(`transferInOutController error: ${e.message}`);
        res.status(500).json({ error: 1, message: e.message });
    }
});

module.exports = transferInOutController;