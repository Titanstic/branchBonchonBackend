const express = require("express");
const dailySaleReportController = express.Router();

const poolQuery = require("../../../misc/poolQuery.js");
const {getSummaryDataReport, getPaymentDataReport, getDiscountDataReport, getPromotionDataReport, getMenuDataReport} = require("./dailySaleModel");


dailySaleReportController.post("/:reportType", async (req, res) => {
    const {reportType} = req.params;
    console.log('dailySaleReportController :', reportType);

    let {startDate, endDate, page} = req.body.input ? req.body.input : req.body;
    startDate += " 00:00:00" ;
    endDate += " 23:59:59";
    const offset = (page - 1) * 10;
    console.log('dailySaleReportController :', startDate, endDate, offset);

    try{
        let dataReport;
        switch (reportType){
            case "summary":
                const { summaryReports, totalSummaryReports } = await getSummaryDataReport(startDate, endDate, offset);
                dataReport = [{pages: Math.ceil(totalSummaryReports.length / 10)},{summaryReports}];
                break;
            case "payment":
                const { paymentReports, totalPaymentReports } = await getPaymentDataReport(startDate, endDate, offset);
                dataReport = [{pages: Math.ceil(totalPaymentReports.length/ 10)},{paymentReports}];
                break;
            case "discount":
                const { discountReports, totalDiscountReports }  = await getDiscountDataReport(startDate, endDate, offset);
                dataReport = [{pages: Math.ceil(totalDiscountReports.length / 10)},{discountReports}];
                break;
            case "promotion":
                const { promotionReports, totalPromotionReports } = await getPromotionDataReport(startDate, endDate, offset);
                dataReport = [{pages: Math.ceil(totalPromotionReports.length/ 10)},{promotionReports}];
                break;
            case "sale":
                const { menuReports, totalMenuReports } = await  getMenuDataReport(startDate, endDate, offset);
                dataReport = [{pages: Math.ceil(totalMenuReports.length/ 10)},{menuReports}];
                break;
        }

        res.status(200).json({ error: 0, message: JSON.stringify(dataReport)});
    }catch (e) {
        console.error('dailySaleReportController error:', e.message);
        res.status(500).json({ error: 1, message: e.message});
    }
});

dailySaleReportController.post("/download/:reportType", async (req, res) => {
    const {reportType} = req.params;
    console.log('dailySaleReportController :', reportType);

    let {startDate, endDate} = req.body.input ? req.body.input : req.body;
    startDate += " 00:00:00" ;
    endDate += " 23:59:59";
    const offset = 0;

    try{
        let dataReport;
        switch (reportType){
            case "summary":
                const { totalSummaryReports } = await getSummaryDataReport(startDate, endDate, offset);
                dataReport = totalSummaryReports;
                break;
            case "payment":
                const { totalPaymentReports } = await getPaymentDataReport(startDate, endDate, offset);
                dataReport = totalPaymentReports;
                break;
            case "discount":
                const { totalDiscountReports }  = await getDiscountDataReport(startDate, endDate, offset);
                dataReport = totalDiscountReports;
                break;
            case "promotion":
                const { totalPromotionReports } = await getPromotionDataReport(startDate, endDate, offset);
                dataReport = totalPromotionReports;
                break;
            case "sale":
                const { totalMenuReports } = await  getMenuDataReport(startDate, endDate, offset);
                dataReport = totalMenuReports;
                break;
        }
        console.log('dailySaleReportController Download :', "Download Successful");
        res.status(200).json({ error: 0, message: JSON.stringify(dataReport)});
    }catch (e) {
        console.error('dailySaleReportController Download error:', e.message);
        res.status(500).json({ error: 1, message: e.message});
    }
});

module.exports = dailySaleReportController;