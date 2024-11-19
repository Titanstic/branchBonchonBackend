const express = require("express");
const stockController = express.Router();
const poolQuery = require("../../misc/poolQuery.js");
const {checkOperation, delay} = require("../utils/mutation");
const {executeCentralMutation} = require("../utils/centralHasuraSync");
const {filterSyncHistory} = require("../utils/syncHistory");
const {addStockItemForGoodReceived, findStockItemById} = require("../models/stockItemsModel");
const {filterStockItemQty} = require("../utils/stock");

stockController.post("/calculate", async (req, res) => {
    const event = req.body.event;
    const transitionId = event.data.new.id;

    try{
        const resMessage = await poolQuery(`SELECT * FROM public.stock_reduce($1);`, [transitionId]);

        res.status(200).json({ success: true, message: resMessage});
    }catch (e) {
        res.status(500).json({ success: true, message: e.message});
    }
});

stockController.post("/goodReceivedItems", async (req, res) => {
    const event = req.body.event;
    const inputData = event.data.new ?? event.data.old;
    const tableName = req.body.table.name;
    console.log(inputData);

    try{
        const stockItemData = await findStockItemById(inputData.stock_id);
        console.log(`stockController stockItemData: ${stockItemData}`);

        const { updateInventoryQty } = filterStockItemQty(tableName, stockItemData, inputData);
        await addStockItemForGoodReceived(inputData.stock_id, updateInventoryQty);

        res.status(200).json({ success: true, message: `Updated Stock item for ${tableName} successfully` });
    }catch (e) {
        res.status(500).json({ success: true, message: e.message});
    }
})


// stockController.post("/order", async (req, res) => {
//     const event = req.body.event;
//     const tableName = req.body.table.name;
//
//     const delayedTables = ["good_received_item", "good_return_item", "purchase_order_item", "transfer_in_items",    "transfer_out_items" , "transfer_out_item", "waste_details" ];
//     if(delayedTables.includes(tableName) && event.op === "INSERT"){
//         await delay(3000);
//     }
//
//     // execute data to central
//     const {query, variables} = await checkOperation(event, tableName);
//     console.log(`[stockOrderRouter] query:`, query)
//     console.log(`[stockOrderRouter] variables:`, variables)
//
//     try{
//         const centralRes = await executeCentralMutation(query, variables);
//         console.log(`[stockOrderRouter] variables:`, centralRes)
//
//         console.log(`[stockOrderRouter] :`, "Order Successfully to cloud");
//         res.status(200).json({ success: true, message: "Order Successfully to cloud" });
//     }catch (e){
//         await filterSyncHistory(query, variables, event);
//
//         console.error(`[stockOrderRouter] Error:`, e.message);
//         res.status(500).json({ success: false, message: e.message });
//     }
// });

module.exports = stockController;