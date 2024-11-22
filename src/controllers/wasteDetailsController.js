const express = require("express");
const wasteDetailsController = express.Router();
const {findStockItemById, updateStockQtyById} = require("../models/stockItemsModel");
const {calculateWasteItem} = require("../utils/wasteDetails");

wasteDetailsController.post("/trigger", async (req, res) => {
    const event = req.body.event;
    const inputData = event.data.new ?? event.data.old;
    const tableName = req.body.table.name;

    try{
        const stockItemData = await findStockItemById(inputData.stock_item_id);
        const {currentPurchaseQty, currentInventoryQty, currentRecipeQty} = calculateWasteItem(stockItemData, inputData.qty);
        await updateStockQtyById(currentPurchaseQty, currentInventoryQty, currentRecipeQty, inputData.stock_item_id);

        res.status(200).json({ success: true, message: `Waste Stock item - ${inputData.stock_item_id} for ${tableName} successfully` });
    }catch (e) {
        res.status(500).json({ success: true, message: e.message});
    }
});

module.exports = wasteDetailsController;