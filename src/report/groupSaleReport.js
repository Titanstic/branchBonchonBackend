const express = require("express");
const groupSaleReportRouter = express.Router();

const poolQuery = require("../../misc/poolQuery.js");

groupSaleReportRouter.post("/", async (req, res) => {
    let {startDate, endDate, page} = req.body.input ? req.body.input : req.body;
    startDate += " 00:00:00" ;
    endDate += " 23:59:59";
    const offset = (page - 1) * 10;
    console.log('groupSaleReportRouter :', startDate, endDate, offset);

    try{
        const { groupSaleReports, totalGroupSaleCount } = await getGroupSaleReport(startDate, endDate, offset);
        const dataReport = [ { pages: Math.ceil(totalGroupSaleCount/10)}, { groupSaleReports }];

        console.log('groupSaleReportRouter dataReport:',dataReport);
        res.status(200).json({ error: 0, message: JSON.stringify(dataReport)});
    }catch (e) {
        console.error('groupSaleReportRouter error:', e.message);
        res.status(500).json({ error: 1, message: e.message});
    }
});

const getGroupSaleReport = async(startDate, endDate, offset) => {
    const groupSaleQuery = `SELECT 
            family_group.family_name,
            sum(transaction_items.quantity) AS qty,
            sum(transaction_items.price) AS amount,
            sum(transaction_items.discount_price) AS discountPrice,
            sum(transaction_items.container_charges) AS containerCharges,
            sum(transaction_items.total_amount) AS netAmount
            FROM transaction_items 
            LEFT JOIN normal_menu_items
            ON transaction_items.normal_menu_item_id = normal_menu_items.id
            LEFT JOIN family_group
            ON normal_menu_items.family_group_id = family_group.id
            WHERE transaction_items.created_at BETWEEN $1 AND $2
            GROUP BY family_group.family_name
            ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""} ;`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];
    const groupSaleDataRes = await poolQuery(groupSaleQuery, variables);
    console.log('dailySaleReportRouter [getGroupSaleReport] groupSaleDataRes:', groupSaleDataRes.rows);

    const totalGroupSaleDataRes = await poolQuery(`SELECT 
            family_group.family_name,
            sum(transaction_items.quantity) AS qty,
            sum(transaction_items.price) AS amount,
            sum(transaction_items.discount_price) AS discountPrice,
            sum(transaction_items.container_charges) AS containerCharges,
            sum(transaction_items.total_amount) AS netAmount
            FROM transaction_items 
            LEFT JOIN normal_menu_items
            ON transaction_items.normal_menu_item_id = normal_menu_items.id
            LEFT JOIN family_group
            ON normal_menu_items.family_group_id = family_group.id
            WHERE transaction_items.created_at BETWEEN $1 AND $2
            GROUP BY family_group.family_name;`, [startDate, endDate])
    console.log('dailySaleReportRouter [getGroupSaleReport] totalSummaryDataRes:', totalGroupSaleDataRes.rows);
    return { groupSaleReports: groupSaleDataRes.rows, totalGroupSaleCount: totalGroupSaleDataRes.rows.length };
}

module.exports = groupSaleReportRouter;