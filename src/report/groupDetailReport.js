const express = require("express");
const groupDetailReportRouter = express.Router();

const poolQuery = require("../../misc/poolQuery.js");

groupDetailReportRouter.post("/:groupType", async (req, res) => {
    const {groupType} = req.params;
    console.log('groupSaleReportRouter :', groupType);

    let {startDate, endDate, page} = req.body.input ? req.body.input : req.body;
    startDate += " 00:00:00" ;
    endDate += " 23:59:59";
    const offset = (page - 1) * 10;
    console.log('groupSaleReportRouter :', startDate, endDate, offset);

    try{
        let dataReport;
        let pages = 0;
        // switch (groupType){
        //     case "summary":
        //         const summaryReports = await getSummaryDataReport(startDate, endDate, offset);
        //         summaryReports.forEach(each => {
        //             pages += Number(each.transactioncount);
        //             delete each.transactioncount;
        //         });
        //         dataReport = [{pages: Math.ceil(pages/ 10)},{summaryReports}];
        //         break;
        //     case "payment":
        //         const paymentReports = await getPaymentDataReport(startDate, endDate, offset);
        //         paymentReports.forEach(each => {
        //             pages += Number(each.transactioncount);
        //             delete each.transactioncount;
        //         });
        //         dataReport = [{pages: Math.ceil(pages/ 10)},{paymentReports}];
        //         break;
        //     case "discount":
        //         const discountReports = await getDiscountDataReport(startDate, endDate, offset);
        //         discountReports.forEach((each, index) => {
        //             pages += Number(each.transactioncount);
        //             delete each.transactioncount;
        //         });
        //         dataReport = [{pages: Math.ceil(pages/ 10)},{discountReports}];
        //         break;
        // }

        res.status(200).json({ error: 0, message: JSON.stringify(dataReport)});
    }catch (e) {
        console.error('dailySaleReportRouter error:', e.message);
        res.status(500).json({ error: 1, message: e.message});
    }
});



module.exports = groupSaleReportRouter;