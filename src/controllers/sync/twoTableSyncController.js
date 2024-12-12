const express = require("express");
const {checkOperation, delay} = require("../../utils/mutation");
const {executeCentralMutation} = require("../../utils/centralHasuraSync");
const {filterSyncHistory} = require("../../utils/syncHistory");
const {findCurrentBranch, findBranch} = require("../../models/branchModel");

const twoTableHasuraSyncRouter = express.Router();

twoTableHasuraSyncRouter.post("/hasura-sync", async (req, res) => {
    const event = req.body.event;
    const tableName = req.body.table.name;

    const delayedTables = ["good_received_item", "good_return_item", "purchase_order_item", "transfer_in_items", "transfer_out_items" , "waste_details", "cashier_drawer_details", "transaction_combo_set", "transaction_items", "transaction_details" ];
    if(delayedTables.includes(tableName) && event.op === "INSERT"){
        await delay(3000);
    }

    // need to add data in stockControl
    if(!delayedTables.includes(tableName)){
        const branchData = await findCurrentBranch();
        event.data.new = { ...event.data.new, "branch_id": branchData.id};
    }
    console.log(`[twoTableHasuraSyncRouter] event:`,  event.data.new);

    const {query, variables} = await checkOperation(event, tableName);
    console.log(`[twoTableHasuraSyncRouter] query:`, query)
    console.log(`[twoTableHasuraSyncRouter] variables:`, variables);

    try{
        const centralRes = await executeCentralMutation(query, variables);

        console.log(`[twoTableHasuraSyncRouter] :`, "Sync Successfully");
        res.status(200).json({ success: true, message: "Sync Successfully" });
    }catch (e) {
        await filterSyncHistory(query, variables, event);

        console.error(`[twoTableHasuraSyncRouter] Error:`, e.message);
        res.status(500).json({ success: false, message: e.message });
    }
});

twoTableHasuraSyncRouter.post("/branchStock", async (req, res) => {
    const event = req.body.event;
    const inputData = event.data.new;

    const query = `
            mutation MyMutation($qty: float8!, $branchId: uuid!, $stockItemId: uuid!) {
                  update_branch_stock_items(where: {branch_id: {_eq: $branchId}, stock_item_id: {_eq: $stockItemId}}, _set: {qty: $qty}) {
                        affected_rows
                  }
            }
        `;

    try{
        const branchData = await findBranch();

        const currentQty = inputData.recipe_unit_id ? inputData.current_qty / inputData.recipe_qty : inputData.current_qty;
        const variables = { qty: currentQty, branchId: branchData.id, stockItemId: inputData.id }

        await executeCentralMutation(query, variables);

        console.log(`[twoTableHasuraSyncRouter] branchStock :`, "Branch stock item Sync Successfully");
        res.status(200).json({ success: true, message: "Branch stock item Sync Successfully" });
    }catch (e) {
        console.error(`[twoTableHasuraSyncRouter] branchStock Error:`, e.message);
        res.status(500).json({ success: false, message: e.message });
    }
})

module.exports = twoTableHasuraSyncRouter;