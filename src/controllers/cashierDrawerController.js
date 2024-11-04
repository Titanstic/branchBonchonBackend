const express = require("express");
const {createCashierDrawer, findCashierDrawerById, findCashierDrawerByTwoId, findCashierDrawerByDate} = require("../models/cashierDrawer/cashierDrawerModel");
const {findDetailByCashierDrawerId, findDetailByTwoId, findDetailByDate} = require("../models/cashierDrawer/cashierDrawerDetailModel");
const {PrintCashierDrawer} = require("../../printer/Print");
const {findEmployeeById} = require("../models/employeeModel");
const {findCurrentBranch} = require("../models/branchModel");

const cashierDrawerController = express.Router();

// create cashier drawer
cashierDrawerController.post("/create", async (req, res) => {
    const {opening_cash, employee_id, posIpAddress } = req.body.input ? req.body.input : req.body;

    try {
        const { cashierDrawerData } = await createCashierDrawer(posIpAddress, opening_cash, employee_id);

        console.log(`cashierDrawerController [create] : `, cashierDrawerData[0]);
        res.status(200).send({error: 0, message: JSON.stringify(cashierDrawerData[0])});
    } catch (e) {
        console.error(`cashierDrawerController [create] error: `, e.message);
        res.status(200).send({error: 1, message: e.message});
    }
});

//print cashier drawer by id
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
        res.status(200).send({error: 1, message: e.message});
    }
});

//print cashier drawer total by two id
cashierDrawerController.post("/print/total", async (req, res) => {
    const { morningId, eveningId, printEmployeeId } = req.body.input ? req.body.input : req.body;

    try {
        const getEmployeeData = await findEmployeeById(printEmployeeId);
        const getBranchData = await findCurrentBranch();

        const getCashierDrawer = await findCashierDrawerByTwoId(morningId, eveningId);
        getCashierDrawer.pickemployeename = getEmployeeData.username;
        getCashierDrawer.printer_name = getEmployeeData.printer_name;
        getCashierDrawer.openemployeename = getEmployeeData.username;

        const getCashierDrawerDetail = await findDetailByTwoId(morningId, eveningId);

        // print
        await PrintCashierDrawer(getCashierDrawer, getCashierDrawerDetail, getBranchData.branch_name);

        console.log(`cashierDrawerController [total print] : Successfully`,);
        res.status(200).send({error: 0, message: "Total Print Successfully"});
    } catch (e) {
        console.error(`cashierDrawerController [total] error: `, e.message);
        res.status(200).send({error: 1, message: e.message});
    }
});

//print cashier drawer total by date
cashierDrawerController.post("/print/allpos", async (req, res) => {
    const { date, printEmployeeId } = req.body.input ? req.body.input : req.body;

    try {
        const getEmployeeData = await findEmployeeById(printEmployeeId);
        const getBranchData = await findCurrentBranch();

        const getCashierDrawer = await findCashierDrawerByDate(date);
        getCashierDrawer.pickemployeename = getEmployeeData.username;
        getCashierDrawer.printer_name = getEmployeeData.printer_name;
        getCashierDrawer.openemployeename = getEmployeeData.username;

        // need to fix
        const getCashierDrawerDetail = await findDetailByDate(date);

        // print
        await PrintCashierDrawer(getCashierDrawer, getCashierDrawerDetail, getBranchData.branch_name);

        console.log(`cashierDrawerController [total print] : Successfully`,);
        res.status(200).send({error: 0, message: "Total Print Successfully"});
    } catch (e) {
        console.error(`cashierDrawerController [total] error: `, e.message);
        res.status(200).send({error: 1, message: e.message});
    }
});


module.exports = cashierDrawerController;
