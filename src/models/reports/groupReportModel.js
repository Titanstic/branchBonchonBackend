const poolQuery = require("../../../misc/poolQuery");

const getGroupDetailSaleReport = async(startDate, endDate, offset) => {
    const groupDetailSaleQuery = `
            SELECT
                family_group.family_name,
                normal_menu_items.code_name,
                normal_menu_items.name,
                sum(transaction_items.price) AS originalPrice,
                sum(transaction_items.quantity) AS qty,
                sum(transaction_items.price * transaction_items.quantity) AS amount,
                sum(transaction_items.discount_price * transaction_items.quantity) AS discountPrice,
                sum(transaction_items.container_charges) AS containerCharges,
                sum(transaction_items.total_amount) AS netAmount
            FROM transaction_items
            LEFT JOIN transactions
                ON transaction_items.transaction_id = transactions.id
            LEFT JOIN normal_menu_items
                ON transaction_items.normal_menu_item_id = normal_menu_items.id
            LEFT JOIN family_group
                ON normal_menu_items.family_group_id = family_group.id
            WHERE transactions.void = false AND  transaction_items.created_at BETWEEN $1 AND $2
            GROUP BY family_group.family_name, normal_menu_items.id
            `;

    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];
    const groupDetailSaleDataRes = await poolQuery(`${groupDetailSaleQuery} ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""} ;`, variables);
    console.log('groupDetailReportRouter [getGroupDetailSaleReport] groupDetailSaleDataRes:', groupDetailSaleDataRes.rows);

    const totalGroupDetailSaleDataRes = await poolQuery(groupDetailSaleQuery, [startDate, endDate])
    console.log('groupDetailReportRouter [getGroupDetailSaleReport] totalGroupDetailSaleDataRes:', totalGroupDetailSaleDataRes.rows);
    return { groupDetailSaleReports: groupDetailSaleDataRes.rows, totalGroupDetailSaleReports: totalGroupDetailSaleDataRes.rows };
}

const getGroupSaleReport = async(startDate, endDate, offset) => {
    const groupSaleQuery = `
            SELECT
                family_group.family_name,
                sum(transaction_items.price * transaction_items.quantity) AS amount,
                sum(transaction_items.quantity) AS qty,
                sum(transaction_items.container_charges) AS containerCharges,
                sum(transaction_items.discount_price * transaction_items.quantity) AS discountPrice,
                CASE SUM(transaction_details.amount) IS NOT NULL
                    WHEN TRUE THEN SUM(transaction_details.amount)
                END  AS appDisCount,
                sum(transaction_items.total_amount) AS netAmount
            FROM transaction_items
            LEFT JOIN transactions
                ON transaction_items.transaction_id = transactions.id
            LEFT JOIN transaction_details 
                      ON transactions.id = transaction_details.transaction_id
            LEFT JOIN normal_menu_items
                ON transaction_items.normal_menu_item_id = normal_menu_items.id
            LEFT JOIN family_group
                ON normal_menu_items.family_group_id = family_group.id
            WHERE transactions.void = false AND  transaction_items.created_at BETWEEN $1 AND $2
            GROUP BY family_group.family_name
            `;

    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];
    const groupSaleDataRes = await poolQuery(`${groupSaleQuery} ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""} ;`, variables);
    console.log('dailySaleReportRouter [getGroupSaleReport] groupSaleDataRes:', groupSaleDataRes.rows);

    const totalGroupSaleDataRes = await poolQuery(groupSaleQuery, [startDate, endDate])
    console.log('dailySaleReportRouter [getGroupSaleReport] totalSummaryDataRes:', totalGroupSaleDataRes.rows);
    return { groupSaleReports: groupSaleDataRes.rows, totalGroupSaleReports: totalGroupSaleDataRes.rows };
}

module.exports = { getGroupDetailSaleReport, getGroupSaleReport };