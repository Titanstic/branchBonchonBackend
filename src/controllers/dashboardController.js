const express = require("express");
const {getDashboardTotalAmount, getBestSellerItems} = require("../models/transaction/transactionItemModel");
const {dashboardQuery} = require("../utils/dashboard");


const dashboardController = express.Router();

dashboardController.post("/", async (req, res) => {
    const { dateFormat } = req.body.input ? req.body.input : req.body;

    try{
        const { dashboardTotalAmountQuery, besetSellerItemQuery } = dashboardQuery(dateFormat);
        const showDashboardData = await getDashboardTotalAmount(dashboardTotalAmountQuery);
        console.log("dashboardRouter :", showDashboardData);

        showDashboardData.bestSellerItems = await getBestSellerItems(besetSellerItemQuery);
        console.log("dashboardRouter :", showDashboardData);

        res.json({ error: 0, message: JSON.stringify(showDashboardData) });
    }catch (e){
        res.json({ error: 1, message: e.message });
    }
})

module.exports = dashboardController;