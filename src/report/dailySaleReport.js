const express = require("express");
const dailySaleReportRouter = express.Router();

const poolQuery = require("../../misc/poolQuery.js");


dailySaleReportRouter.post("/:reportType", async (req, res) => {
    const {reportType} = req.params;
    console.log('dailySaleReportRouter :', reportType);

    let {startDate, endDate, page} = req.body.input ? req.body.input : req.body;
    startDate += " 00:00:00" ;
    endDate += " 23:59:59";
    const offset = (page - 1) * 10;
    console.log('dailySaleReportRouter :', startDate, endDate, offset);

    try{
        let dataReport;
        let pages = 0;
        switch (reportType){
            case "summary":
                const summaryReports = await getSummaryDataReport(startDate, endDate, offset);
                summaryReports.forEach(each => {
                    pages += Number(each.transactioncount);
                    delete each.transactioncount;
                });
                dataReport = [{pages: Math.ceil(pages/ 10)},{summaryReports}];
                break;
            case "payment":
                const paymentReports = await getPaymentDataReport(startDate, endDate, offset);
                paymentReports.forEach(each => {
                    pages += Number(each.transactioncount);
                    delete each.transactioncount;
                });
                dataReport = [{pages: Math.ceil(pages/ 10)},{paymentReports}];
                break;
            case "discount":
                const discountReports = await getDiscountDataReport(startDate, endDate, offset);
                discountReports.forEach((each, index) => {
                    pages += Number(each.transactioncount);
                    delete each.transactioncount;
                });
                dataReport = [{pages: Math.ceil(pages/ 10)},{discountReports}];
                break;
            case "promotion":
                const promotionReports = await getPromotionDataReport(startDate, endDate, offset);
                promotionReports.forEach(each => {
                    pages += Number(each.transactioncount);
                    delete each.transactioncount;
                });
                dataReport = [{pages: Math.ceil(pages/ 10)},{promotionReports}];
                break;
            case "sale":
                const menuReports = await  getMenuDataReport(startDate, endDate, offset);
                menuReports.forEach(each => {
                    pages += Number(each.transactioncount);
                    delete each.transactioncount;
                });
                dataReport = [{pages: Math.ceil(pages/ 10)},{menuReports}];
                break;
        }

        res.status(200).json({ error: 0, message: JSON.stringify(dataReport)});
    }catch (e) {
        console.error('dailySaleReportRouter error:', e.message);
        res.status(500).json({ error: 1, message: e.message});
    }
});

const getSummaryDataReport = async (startDate, endDate, offset) => {
    const query = `SELECT sum(grand_total_amount) AS grandTotal, 
            sum(sub_total_amount) AS subTotal, 
            sum(tax_amount) AS taxTotal, 
            sum(service_charge_amount) AS serviceChargeTotal, sum(discount_amount) AS discountTotal,
            DATE(created_at),
            COUNT(*) AS transactionCount
            FROM transactions 
            WHERE created_at BETWEEN $1 AND $2
            GROUP BY DATE(created_at)
            ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""} ;`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];

    const summaryDataRes = await poolQuery(query, variables)
    console.log('dailySaleReportRouter [getSummaryDataReport] summaryDataRes:', summaryDataRes.rows);
    return summaryDataRes.rows;
}

const getPaymentDataReport = async (startDate, endDate, offset) => {
    const query = `SELECT sum(transactions.grand_total_amount) AS grandTotal, DATE(transactions.created_at) AS date, payment_types.payment_name,COUNT(transactions.id) AS transactionCount
        FROM transactions
        LEFT JOIN payment_types
        ON transactions.payment_type_id = payment_types.id
        WHERE transactions.created_at BETWEEN $1 AND $2
        GROUP BY DATE(transactions.created_at), payment_types.payment_name
        ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""} ;`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];

    const paymentDataRes = await poolQuery(query, variables);
    console.log('dailySaleReportRouter [findDailySale] paymentDataRes:', paymentDataRes.rows);
    return paymentDataRes.rows;
}

const getDiscountDataReport = async (startDate, endDate, offset) => {
    const query = `SELECT sum(grand_total_amount) AS grandTotal,
        DATE(created_at) AS date,
        discount_name,
        COUNT(*) AS transactionCount
        FROM transactions
        WHERE created_at BETWEEN $1 AND $2
        AND discount_name != ''
        GROUP BY DATE(created_at), discount_name
        ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""};`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];

    const discountDataRes = await poolQuery(query,variables);
    console.log('dailySaleReportRouter [findDailySale] discountDataRes:', discountDataRes.rows);
    return discountDataRes.rows;
}

const getPromotionDataReport = async (startDate, endDate, offset) => {
    const query = `SELECT DATE(transaction_items.created_at),
        sum(transaction_items.total_amount) AS grandTotal,
        promotion.name,
        COUNT(transaction_items.id) AS transactionCount
        FROM transaction_items 
        LEFT JOIN promotion_items
        ON transaction_items.normal_menu_item_id = promotion_items.normal_menu_item_id
        LEFT JOIN promotion
        ON promotion_items.promotion_id = promotion.id
        WHERE transaction_items.created_at BETWEEN $1 AND $2
        GROUP BY DATE(transaction_items.created_at), promotion.name
        ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""};`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];

    const promotionDataRes = await poolQuery(query,variables);
    console.log('dailySaleReportRouter [findDailySale] getPromotionDataReport:', promotionDataRes.rows);
    return promotionDataRes.rows;
}

const getMenuDataReport = async (startDate, endDate, offset) => {
    const query = `SELECT 
        DATE(transaction_items.created_at),
        sum(transaction_items.total_amount) AS grandTotal,
        menu.menu_name,
        COUNT(transaction_items.id) AS transactionCount
        FROM transaction_items 
        LEFT JOIN normal_menu_items
        ON transaction_items.normal_menu_item_id = normal_menu_items.id
        LEFT JOIN menu
        ON normal_menu_items.menu_id = menu.id
        WHERE transaction_items.created_at BETWEEN $1 AND $2
        GROUP BY DATE(transaction_items.created_at),menu.menu_name
        ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""};`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];

    const menuDataRes = await poolQuery(query,variables);
    console.log('dailySaleReportRouter [findDailySale] getMenuDataReport:', menuDataRes.rows);
    return menuDataRes.rows;
}

module.exports = dailySaleReportRouter;