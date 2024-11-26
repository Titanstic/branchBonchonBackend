const express = require("express");
const goodReturnItemController = express.Router();
const {findStockItemById, updateStockQtyById} = require("../../models/stockItemsModel");
const {reducePurchaseUnit} = require("../../utils/stockControl/purchaseUnit");

goodReturnItemController.post("/trigger", async (req, res) => {
    const event = req.body.event;
    const inputData = event.data.new ?? event.data.old;
    const tableName = req.body.table.name;

    try{
        const stockItemData = await findStockItemById(inputData.stock_id);

        // add stockControl in branch
        const { currentPurchaseQty, currentInventoryQty, currentRecipeQty } = reducePurchaseUnit(stockItemData);
        await updateStockQtyById(currentPurchaseQty, currentInventoryQty, currentRecipeQty, inputData.stock_id);

        console.log(`goodReturnItemController: `, `Updated Stock item for ${tableName} successfully`);
        res.status(200).json({ success: true, message: `Updated Stock item for ${tableName} successfully` });
    }catch (e) {
        res.status(500).json({ success: true, message: e.message});
    }
});

module.exports = goodReturnItemController;