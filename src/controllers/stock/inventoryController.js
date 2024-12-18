const express = require("express");
const inventoryController = express.Router();
const {findStockItemById, updateStockQtyById, getStockItemAndRecipeByMenuId} = require("../../models/stock/stockItemsModel");
const {addPurchaseUnit, reducePurchaseUnit} = require("../../utils/stockControl/purchaseUnit");
const {reduceInventoryUnit, addInventoryUnit} = require("../../utils/stockControl/inventoryUnit");
const {findWasteTypeById} = require("../../models/stock/wasteModal");
const {insertInventoryTransaction} = require("../../models/stock/inventoryTransactionModel");
const poolQuery = require("../../../misc/poolQuery");
const {filterInventoryReport, calculateFinishStockItem} = require("../../utils/stockControl/inventory");
const {getNormalMenuItemByComboId} = require("../../models/stock/comboSetModel");
const {getInventoryReportByDate} = require("../../models/stock/inventoryModel");

inventoryController.post("/getReport", async (req, res) => {
    const { startDate, endDate } = req.body.input ?? req.body;

    try{
        const inventoryReport = await getInventoryReportByDate(startDate, endDate);
        console.table(inventoryReport);

        console.log(`inventoryController [getReport] :`, `Get Inventory Report Successfully`);
        res.status(200).json({ error: 0, message: `Get Inventory Report Successfully`, data: inventoryReport });
    }catch (e) {
        console.error(`inventoryController [goodReceivedItem] error: `, e.message);
        res.status(200).json({ error: 1, message: e.message});
    }
})

inventoryController.post("/goodReceivedItem/trigger", async (req, res) => {
    const event = req.body.event;
    const inputData = event.data.new ?? event.data.old;
    const tableName = req.body.table.name;

    try{
        const stockItemData = await findStockItemById(inputData.stock_id);
        const openingSale = stockItemData.recipe_unit ? stockItemData.current_qty / stockItemData.s_recipe_qty : stockItemData.current_qty;

        // add stockControl in branch
        const { addInventoryQty, currentQty } = addPurchaseUnit(stockItemData, inputData.qty);

        await poolQuery(`BEGIN`);
            await updateStockQtyById(currentQty, inputData.stock_id);
            await insertInventoryTransaction(inputData.stock_id, stockItemData.current_qty, currentQty, tableName, inputData.id, inputData.qty);
            await filterInventoryReport(inputData.stock_id, tableName, openingSale, addInventoryQty);
        await poolQuery(`COMMIT`);

        console.log(`inventoryController [goodReceivedItem] :`, `Updated Stock item for ${tableName} successfully`);
        res.status(200).json({ success: true, message: `Updated Stock item for ${tableName} successfully` });
    }catch (e) {
        console.error(`inventoryController [goodReceivedItem] error: `, e.message);
        res.status(500).json({ success: false, message: e.message});
    }
});

inventoryController.post("/goodReturnItem/trigger", async (req, res) => {
    const event = req.body.event;
    const inputData = event.data.new ?? event.data.old;
    const tableName = req.body.table.name;

    try{
        const stockItemData = await findStockItemById(inputData.stock_id);
        const openingSale = stockItemData.recipe_unit ? stockItemData.current_qty / stockItemData.s_recipe_qty : stockItemData.current_qty;

        // add stockControl in branch
        const {reduceInventoryQty, currentQty} = reducePurchaseUnit(stockItemData, inputData.qty);
        await poolQuery(`BEGIN`);
            await updateStockQtyById(currentQty, inputData.stock_id);
            await insertInventoryTransaction(inputData.stock_id, stockItemData.current_qty, currentQty, tableName, inputData.id, inputData.qty);
            await filterInventoryReport(inputData.stock_id, tableName, openingSale, -reduceInventoryQty);
        await poolQuery(`COMMIT`);

        console.log(`goodReturnItemController [goodReturnItem]: `, `Updated Stock item for ${tableName} successfully`);
        res.status(200).json({ success: true, message: `Updated Stock item for ${tableName} successfully` });
    }catch (e) {
        console.error(`inventoryController [goodReturnItem] error: `, e.message);
        res.status(500).json({ success: true, message: e.message});
    }
});

inventoryController.post("/wasteDetails/trigger", async (req, res) => {
    const event = req.body.event;
    const action = event.op;
    const inputData = event.data.new ?? event.data.old;

    try{
        const stockItemData = await findStockItemById(inputData.stock_item_id);
        const openingSale = stockItemData.recipe_unit ? stockItemData.current_qty / stockItemData.s_recipe_qty : stockItemData.current_qty;

        const { waste_type } = await findWasteTypeById(inputData.wastes_id);

        await poolQuery(`BEGIN`);
            const currentQty = waste_type === "adjustment" ?
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
            await updateStockQtyById(currentQty, inputData.stock_item_id);
            await insertInventoryTransaction(inputData.stock_item_id, stockItemData.current_qty, currentQty, waste_type, inputData.id, inputData.qty);

            // add or update inventory report
            const inventoryQty = waste_type === "adjustment" ? Number(inputData.qty) : -Number(inputData.qty);
            await filterInventoryReport(inputData.stock_item_id, waste_type, openingSale, inventoryQty);
        await poolQuery(`COMMIT`);

        console.log(`goodReturnItemController [wasteDetails]: `, `stock item id - ${inputData.stock_item_id} for ${waste_type} successfully`);
        res.status(200).json({ success: true, message: `stock item id - ${inputData.stock_item_id} for ${waste_type} successfully` });
    }catch (e) {
        console.error(`inventoryController [wasteDetails] error: `, e.message);
        res.status(500).json({ success: true, message: e.message});
    }
});

inventoryController.post("/finishWasteDetails/trigger", async (req, res) => {
    const event = req.body.event;
    const inputData = event.data.new ?? event.data.old;

    try{
        if(inputData.normal_menu_id){
            await calculateFinishStockItem(inputData.normal_menu_id, inputData.takeaway, "finish", inputData.qty);
        }else{
            const normalMenuItem = await getNormalMenuItemByComboId(inputData.combo_set_id);

            for (const item of normalMenuItem) {
                const totalQty = inputData.qty * item.qty;
                await calculateFinishStockItem(item.id, inputData.takeaway, "finish", totalQty);
            }
        }

        console.log(`goodReturnItemController [finishWasteDetails]: `, `Finish Waste successfully`);
        res.status(200).json({ success: true, message: `Finish Waste successfully` });
    }catch (e) {
        console.error(`inventoryController [finishWasteDetails] error: `, e.message);
        res.status(500).json({ success: true, message: e.message});
    }
});

module.exports = inventoryController;