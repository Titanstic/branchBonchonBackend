const {deleteHasuraEventLog} = require("../models/dbCleanModel");
const dbCleanController = require("express").Router();

dbCleanController.post("/clean", async (req, res) => {
    try {
        const hasuraEventCount = await deleteHasuraEventLog();

        console.log(`[dbCleanController] :`, "Clean Successfully");
        res.status(200).json({ success: true, message: `SyncHistoryCount's ${syncHistoryCount} and hasuraEventCount's ${hasuraEventCount} Clean Successfully` });
    } catch (e) {
        console.error(`[dbCleanController] Error:`, e.message);
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = dbCleanController;