const express = require("express");
const goodReceivedItemController = express.Router();
const {findStockItemById, updateStockQtyById} = require("../models/stockItemsModel");

goodReceivedItemController.post("/trigger", async (req, res) => {
    const event = req.body.event;
    const inputData = event.data.new ?? event.data.old;
    const tableName = req.body.table.name;

    try{
        const stockItemData = await findStockItemById(inputData.stock_id);

        // add stock in branch
        stockItemData.s_purchase_qty += inputData.qty;
        console.log(`goodReceivedItemController currentPurchaseQty: `, stockItemData.s_purchase_qty);

        if(stockItemData.purchase_unit !== stockItemData.inventory_unit){
            const getInventoryQty = inputData.qty * stockItemData.inventory_qty;
            stockItemData.s_inventory_qty += getInventoryQty;
        }else{
            stockItemData.s_inventory_qty += inputData.qty;
        }
        console.log(`goodReceivedItemController currentInventoryQty: `, stockItemData.s_inventory_qty);

        if(stockItemData.s_recipe_qty){
            const getInventoryQty = inputData.qty * stockItemData.inventory_qty;

            if(stockItemData.inventory_unit !== stockItemData.recipe_unit ){
                const getRecipeQty = getInventoryQty * stockItemData.recipe_qty;
                stockItemData.s_recipe_qty += getRecipeQty;
            }else{
                stockItemData.s_recipe_qty += getInventoryQty;
            }
            console.log(`goodReceivedItemController currentRecipeUnit: `, stockItemData.s_recipe_qty);
        }

        await updateStockQtyById(stockItemData.s_purchase_qty, stockItemData.s_inventory_qty, stockItemData.s_recipe_qty, inputData.stock_id);

        console.log(`goodReceivedItemController currentRecipeUnit: `, `Updated Stock item for ${tableName} successfully`);
        res.status(200).json({ success: true, message: `Updated Stock item for ${tableName} successfully` });
    }catch (e) {
        res.status(500).json({ success: true, message: e.message});
    }
});

module.exports = goodReceivedItemController;