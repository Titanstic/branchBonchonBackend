const express = require("express");
const {createCashierDrawer} = require("./cashierDrawerModal");

const cashierDrawerController = express.Router();

cashierDrawerController.post("/create", async (req, res) => {
    const posIpAddress = req.ip;
    const {opening_cash, employee_id} = req.body.input ? req.body.input : req.body;

    try {
        const { cashierDrawerData } = await createCashierDrawer(posIpAddress, opening_cash, employee_id);

        res.status(200).send({error: 0, message: JSON.stringify(cashierDrawerData[0])});
    } catch (e) {
        console.error(`cashierDrawerController error: `, e.message);
        res.status(500).send({error: 1, message: e.message});
    }
})

module.exports = cashierDrawerController;
