const express = require("express");
const dailySaleReportRouter = express.Router();
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const poolQuery = require("../../misc/poolQuery.js");
// Create a directory for reports if it doesn't exist
const reportsDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
}

dailySaleReportRouter.post("/", async (req, res) => {
    let {startDate, endDate} = req.body.input ? req.body.input : req.body;
    startDate += " 00:00:00" ;
    endDate += " 23:59:59"

    console.log('dailySaleReportRouter :', startDate, endDate);
    try{
        const summaryDataReport = await getSummaryDataReport(startDate, endDate);
        const paymentDataReport = await getPaymentDataReport(startDate, endDate);
        const discountDataReport = await getDiscountDataReport(startDate, endDate);

        const data = [
            { summaryReport: summaryDataReport },
            { paymentReport: paymentDataReport},
            { discountReport: discountDataReport}
        ];
        res.status(200).json({ success: true, data: data});
    }catch (e) {
        console.error('dailySaleReportRouter error:', e.message);
        res.status(500).json({ success: true, message: e.message});
    }
});

const getSummaryDataReport = async (startDate, endDate) => {
    const summaryDataRes = await poolQuery(`SELECT sum(grand_total_amount) AS grandTotal, 
            sum(sub_total_amount) AS subTotal, 
            sum(tax_amount) AS taxTotal, 
            sum(service_charge_amount) AS serviceChargeTotal, sum(discount_amount) AS discountTotal,
            DATE(created_at) 
            FROM transactions 
            WHERE created_at BETWEEN $1 AND $2
            GROUP BY DATE(created_at);`,
        [startDate, endDate]
    )
    console.log('dailySaleReportRouter [findDailySale] summaryDataRes:', summaryDataRes.rows);
    return summaryDataRes.rows;
}

const getPaymentDataReport = async (startDate, endDate) => {
    const paymentDataRes = await poolQuery(`
        SELECT sum(transactions.grand_total_amount) AS grandTotal, DATE(transactions.created_at) AS date, payment_types.payment_name
        FROM transactions
        LEFT JOIN payment_types
        ON transactions.payment_type_id = payment_types.id
        WHERE transactions.created_at BETWEEN $1 AND $2
        GROUP BY DATE(transactions.created_at), payment_types.payment_name;`,
        [startDate, endDate]
    )
    console.log('dailySaleReportRouter [findDailySale] paymentDataRes:', paymentDataRes.rows);
    return paymentDataRes.rows;
}

const getDiscountDataReport = async (startDate, endDate) => {
    const discountDataRes = await poolQuery(`
        SELECT sum(grand_total_amount) AS grandTotal,
        DATE(created_at) AS date,
        discount_name
        FROM transactions
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY DATE(created_at), discount_name;`,
        [startDate, endDate]
    )
    console.log('dailySaleReportRouter [findDailySale] discountDataRes:', discountDataRes.rows);

    return discountDataRes.rows;
}

module.exports = dailySaleReportRouter;