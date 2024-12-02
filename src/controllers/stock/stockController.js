const express = require("express");
const stockController = express.Router();
const {findTransactionItemsByTransactionId} = require("../../models/transaction/transactionItemModel");
const {getComboSetByTransactionId} = require("../../models/transaction/transactionComboSetModel");
const {calculateStock} = require("../../utils/stockControl/stock");

stockController.post("/calculate", async (req, res) => {
    const event = req.body.event;
    const transitionData = event.data.new;

    try{
        // 1. find transaction item or combo set
        const transactionItem = await findTransactionItemsByTransactionId(transitionData.id);
        console.log(`stockController transactionItem: `, transactionItem);
        await calculateStock(transactionItem, transitionData.void);

        const transactionComboSet = await getComboSetByTransactionId(transitionData.id);
        console.log(`stockController transactionComboSet: `, transactionComboSet);
        await calculateStock(transactionComboSet, transitionData.void);

        // const resMessage = await poolQuery(`SELECT * FROM public.stock_reduce($1);`, [transitionId]);
        console.log(`stockController Successfully calculated stock items`);
        res.status(200).json({ success: true, message: "Successfully calculated stockControl items" });
    }catch (e) {
        res.status(500).json({ success: true, message: e.message});
    }
});


module.exports = stockController;