const express = require("express");
const inventoryController = express.Router();
const {findStockItemById, updateStockQtyById} = require("../../models/stock/stockItemsModel");
const {addPurchaseUnit, reducePurchaseUnit} = require("../../utils/stockControl/purchaseUnit");
const {reduceInventoryUnit, addInventoryUnit} = require("../../utils/stockControl/inventoryUnit");
const {findWasteTypeById} = require("../../models/stock/wasteModal");

inventoryController.post("/goodReceivedItem/trigger", async (req, res) => {
    const event = req.body.event;
    const inputData = event.data.new ?? event.data.old;
    const tableName = req.body.table.name;

    try{
        const stockItemData = await findStockItemById(inputData.stock_id);

        // add stockControl in branch
        const { currentPurchaseQty, currentInventoryQty, currentRecipeQty } = addPurchaseUnit(stockItemData, inputData);
        await updateStockQtyById(currentPurchaseQty, currentInventoryQty, currentRecipeQty, inputData.stock_id);

        console.log(`inventoryController currentRecipeUnit: `, `Updated Stock item for ${tableName} successfully`);
        res.status(200).json({ success: true, message: `Updated Stock item for ${tableName} successfully` });
    }catch (e) {
        res.status(500).json({ success: false, message: e.message});
    }
});

inventoryController.post("/goodReturnItem/trigger", async (req, res) => {
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

inventoryController.post("/wasteDetails/trigger", async (req, res) => {
    const event = req.body.event;
    const action = event.op;
    const inputData = event.data.new ?? event.data.old;
    const tableName = req.body.table.name;

    try{
        const stockItemData = await findStockItemById(inputData.stock_item_id);

        const { waste_type } = await findWasteTypeById(inputData.wastes_id);
        const {currentPurchaseQty, currentInventoryQty, currentRecipeQty} =
            waste_type === "adjustment" ?
                (
                    Math.sign(Number(inputData.qty)) > 0 ?
                        addInventoryUnit(stockItemData, Number(inputData.qty))
                    :
                        reduceInventoryUnit(stockItemData, Number(inputData.qty))
                )
                :
                (
                    action === "INSERT" ?
                        reduceInventoryUnit(stockItemData, Number(inputData.qty))
                        :
                        addInventoryUnit(stockItemData, Number(inputData.qty))
                )
        ;

        await updateStockQtyById(currentPurchaseQty, currentInventoryQty, currentRecipeQty, inputData.stock_item_id);
        res.status(200).json({ success: true, message: `stock item id - ${inputData.stock_item_id} for ${waste_type} successfully` });
    }catch (e) {
        res.status(500).json({ success: true, message: e.message});
    }
});

module.exports = inventoryController;