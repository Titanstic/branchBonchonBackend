const express = require("express");
const stockController = express.Router();
const {findTransactionItemsByTransactionId} = require("../../models/transaction/transactionItemModel");
const {getComboSetByTransactionId} = require("../../models/transaction/transactionComboSetModel");
const {calculateStock} = require("../../utils/stockControl/stock");
const {getLastDocNo} = require("../../models/stock/inventoryModel");
const {findBranch} = require("../../models/branchModel");

// TODO: `Consider For batch
stockController.post("/calculate", async (req, res) => {
    const event = req.body.event;
    const transitionData = event.data.new;

    const currentDate = new Date().toLocaleDateString("en-US", { timeZone: "Asia/Yangon" });
    const transactionDate = new Date(transitionData.created_at).toLocaleDateString("en-US", { timeZone: "Asia/Yangon" })

    try{
        if(currentDate === transactionDate) {
            const transactionItem = await findTransactionItemsByTransactionId(transitionData.id);
            console.log(`stockController transactionItem: `, transactionItem);
            await calculateStock(transactionItem, transitionData.void);

            const transactionComboSet = await getComboSetByTransactionId(transitionData.id);
            console.log(`stockController transactionComboSet: `, transactionComboSet);
            await calculateStock(transactionComboSet, transitionData.void);
        }

        // const resMessage = await poolQuery(`SELECT * FROM public.stock_reduce($1);`, [transitionId]);
        console.log(`stockController Successfully calculated stock items`);
        res.status(200).json({ success: true, message: "Successfully calculated stockControl items" });
    }catch (e) {
        res.status(500).json({ success: false, message: e.message});
    }
});

stockController.post("/generateDocNo", async (req, res) => {
    const { tableName } = req.body.input ?? req.body;
    let latestDocNo = "";

    try{
        const getBranchData = await findBranch();
        const serialNo = getBranchData.serial_no.toString().padStart(2, '0');
        console.log(`stockController [generateDocNo] serialNo: ${serialNo}`);

        const newDocNo = await getLastDocNo(tableName, getBranchData.id);
        switch (tableName) {
            case "purchase_order":
                latestDocNo = `PO ${serialNo}${newDocNo}`;
                break;
            case "good_received":
                latestDocNo = `GR ${serialNo}${newDocNo}`;
                break;
            case "good_return":
                latestDocNo = `GRT ${serialNo}${newDocNo}`;
                break;
            case "transfer_in":
                latestDocNo = `TI ${serialNo}${newDocNo}`;
                break;
            case "transfer_out":
                latestDocNo = `TO ${serialNo}${newDocNo}`;
                break;
        }

        console.log(`stockController [generateDocNo]: Successfully Generate Doc No - ${latestDocNo}  for ${tableName}`);
        res.status(200).json({ success: 0, message: `Successfully Generate Doc No - ${latestDocNo} for ${tableName}`, docNo: latestDocNo });
    }catch (e) {
        console.error(`stockController [generateDocNo] error: `, e.message);
        res.status(200).json({ success: 1, message: e.message});
    }
});

module.exports = stockController;
