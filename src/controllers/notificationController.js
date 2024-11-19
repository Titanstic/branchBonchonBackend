const express = require("express");
const {insertNotification} = require("../models/notificationModel");
const {filterNotification} = require("../utils/notification");

const notificationRouter = express.Router();

notificationRouter.post("/", async (req, res) => {
    const event = req.body.event;
    const tableName = req.body.table.name;
    const action = event.op;

    try{
        const data = event.data.new;
        console.log(`[twoTableHasuraSyncRouter] notification data:`, data)

        const {title, description} = await filterNotification(data, tableName, action);
        await insertNotification(title, description);

        console.log(`[notificationRouter] :`, "Notification Successfully");
        res.status(200).json({ success: true, message: "Notification Successfully" });
    }catch (e) {
        console.error(`[notificationRouter] error:`, e.message);
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = notificationRouter;