const express = require("express");
const {executeCentralMutation, checkOperation} = require("../utils");
const stockOrderRouter = express.Router();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

stockOrderRouter.post("/", async (req, res) => {
    const event = req.body.event;
    const tableName = req.body.table.name;

    try{
        if((tableName === "purchase_order_item" || tableName === "good_return_item" || tableName === "good_received_item") && event.op === "INSERT"){
            await delay(3000);
        }

        // execute data to central
        const {query, variables} = await checkOperation(event, tableName);
        await executeCentralMutation(query, variables);

        console.log(`[stockOrderRouter] :`, "Order Successfully to cloud");
        res.status(200).json({ success: true, message: "Order Successfully to cloud" });
    }catch (e){
        console.error(`[stockOrderRouter] Error:`, e.message);
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = stockOrderRouter;