const express = require("express");
const {createCashierDrawer} = require("./cashierDrawerModal");
const os = require('os');

const cashierDrawerController = express.Router();

cashierDrawerController.post("/create", async (req, res) => {
    const {opening_cash, employee_id, posIpAddress } = req.body.input ? req.body.input : req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Client IP Address:', ip)
    try {
        const { cashierDrawerData } = await createCashierDrawer(ip, opening_cash, employee_id);

        res.status(200).send({error: 0, message: JSON.stringify(cashierDrawerData[0])});
    } catch (e) {
        console.error(`cashierDrawerController error: `, e.message);
        res.status(500).send({error: 1, message: e.message});
    }
});


module.exports = cashierDrawerController;
