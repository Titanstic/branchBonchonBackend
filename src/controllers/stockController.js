const express = require("express");
const stockController = express.Router();
const poolQuery = require("../../misc/poolQuery.js");
const {checkOperation} = require("../utils/stock");
const {executeCentralMutation} = require("../utils/centralHasuraSync");

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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

stockController.post("/order", async (req, res) => {
    const event = req.body.event;
    const tableName = req.body.table.name;

    try{
        if((tableName === "purchase_order_item" || tableName === "good_return_item" || tableName === "good_received_item") && event.op === "INSERT"){
            await delay(3000);
        }

        if(tableName  === "purchase_order" || tableName === "good_received" || tableName === "good_return"){
            delete event.data.new.sync;
        }

        // execute data to central
        const {query, variables} = await checkOperation(event, tableName);
        const centralRes = await executeCentralMutation(query, variables);

        if(!centralRes.errors){
            const purchaseOrderId = event.data.new.id;
            await poolQuery(`UPDATE ${tableName} SET sync = true WHERE id = $1;`, [purchaseOrderId]);
        }

        console.log(`[stockOrderRouter] :`, "Order Successfully to cloud");
        res.status(200).json({ success: true, message: "Order Successfully to cloud" });
    }catch (e){
        console.error(`[stockOrderRouter] Error:`, e.message);
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = stockController;