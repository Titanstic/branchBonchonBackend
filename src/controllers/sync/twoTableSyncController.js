const express = require("express");
const {checkOperation, delay} = require("../../utils/mutation");
const {executeCentralMutation} = require("../../utils/centralHasuraSync");
const {filterSyncHistory} = require("../../utils/syncHistory");
const {findCurrentBranch} = require("../../models/branchModel");

const twoTableHasuraSyncRouter = express.Router();

twoTableHasuraSyncRouter.post("/hasura-sync", async (req, res) => {
    const event = req.body.event;
    const tableName = req.body.table.name;

    const delayedTables = ["good_received_item", "good_return_item", "purchase_order_item", "transfer_in_items", "transfer_out_items" , "waste_details", "cashier_drawer_details" ];
    if(delayedTables.includes(tableName) && event.op === "INSERT"){
        await delay(3000);
    }

    // const notificationTables = ["cashier_drawer", "good_received", "good_return", "purchase_order", "transfer_in", "transfer_out", "wastes"];
    // if(notificationTables.includes(tableName) && event.op === "INSERT"){
    //     const data = event.data.new;
    //     console.log(`[twoTableHasuraSyncRouter] notification data:`, data)
    //
    //     await filterNotification(data, tableName);
    // }
    const branchData = await findCurrentBranch();

    const {query, variables} = await checkOperation(event, tableName, branchData.id);
    console.log(`[twoTableHasuraSyncRouter] query:`, query)
    console.log(`[twoTableHasuraSyncRouter] variables:`, variables);

    try{
        const centralRes = await executeCentralMutation(query, variables);
        console.log(centralRes);

        console.log(`[twoTableHasuraSyncRouter] :`, "Sync Successfully");
        res.status(200).json({ success: true, message: "Sync Successfully" });
    }catch (e) {
        await filterSyncHistory(query, variables, event);

        console.error(`[twoTableHasuraSyncRouter] Error:`, e.message);
        res.status(500).json({ success: false, message: e.message });
    }
});


module.exports = twoTableHasuraSyncRouter;