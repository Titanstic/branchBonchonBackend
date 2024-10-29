const express = require("express");
const {createCashierDrawer, findCashierDrawerById, findCashierDrawerGroupBy} = require("./cashierDrawerModal");
const {findDetailByCashierDrawerId} = require("./cashierDrawerDetailModa");
const {PrintCashierDrawer} = require("../../printer/Print");
const {findCurrentBranch} = require("../utils");

const cashierDrawerController = express.Router();

cashierDrawerController.post("/create", async (req, res) => {
    const {opening_cash, employee_id, posIpAddress } = req.body.input ? req.body.input : req.body;

    try {
        const { cashierDrawerData } = await createCashierDrawer(posIpAddress, opening_cash, employee_id);

        console.log(`cashierDrawerController [create] : `, cashierDrawerData[0]);
        res.status(200).send({error: 0, message: JSON.stringify(cashierDrawerData[0])});
    } catch (e) {
        console.error(`cashierDrawerController [create] error: `, e.message);
        res.status(500).send({error: 1, message: e.message});
    }
});

cashierDrawerController.post("/total", async (req, res) => {
    const { startDate, endDate } = req.body.input ? req.body.input : req.body;

    try {
        const cashierDrawerData = await findCashierDrawerGroupBy(startDate, endDate);

        console.log(`cashierDrawerController [total] : `, cashierDrawerData);
        res.status(200).send({error: 0, message: JSON.stringify(cashierDrawerData)});
    } catch (e) {
        console.error(`cashierDrawerController [total] error: `, e.message);
        res.status(500).send({error: 1, message: e.message});
    }
});

cashierDrawerController.post("/print", async (req, res) => {
    const { cashierDrawerId } = req.body.input ? req.body.input : req.body;

    try{
        const getBranchData = await findCurrentBranch();
        const getCashierDrawer = await findCashierDrawerById(cashierDrawerId);
        const getCashierDrawerDetail = await findDetailByCashierDrawerId(cashierDrawerId);

        // print
        await PrintCashierDrawer(getCashierDrawer, getCashierDrawerDetail, getBranchData.branch_name);

        console.log(`cashierDrawerController [print]: Cashier Drawer Print Successfully`);
        res.status(200).send({error: 0, message: "Cashier Drawer Print Successfully"});
    }catch (e){
        console.error(`cashierDrawerController [print] error: `, e.message);
        res.status(500).send({error: 1, message: e.message});
    }
})

module.exports = cashierDrawerController;
