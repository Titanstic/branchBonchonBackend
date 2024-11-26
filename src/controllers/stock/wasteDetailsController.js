const express = require("express");
const wasteDetailsController = express.Router();
const {findStockItemById, updateStockQtyById} = require("../../models/stockItemsModel");
const {reduceInventoryUnit, addInventoryUnit} = require("../../utils/stockControl/inventoryUnit");

wasteDetailsController.post("/trigger", async (req, res) => {
    const event = req.body.event;
    const action = event.op;
    const inputData = event.data.new ?? event.data.old;
    const tableName = req.body.table.name;

    try{
        const stockItemData = await findStockItemById(inputData.stock_item_id);
        const {currentPurchaseQty, currentInventoryQty, currentRecipeQty} = action === "INSERT" ?
            reduceInventoryUnit(stockItemData, inputData.qty)
            :
            addInventoryUnit(stockItemData, inputData.qty)
        ;
        await updateStockQtyById(currentPurchaseQty, currentInventoryQty, currentRecipeQty, inputData.stock_item_id);

        res.status(200).json({ success: true, message: `stock item id - ${inputData.stock_item_id} for ${tableName} successfully` });
    }catch (e) {
        res.status(500).json({ success: true, message: e.message});
    }
});

module.exports = wasteDetailsController;