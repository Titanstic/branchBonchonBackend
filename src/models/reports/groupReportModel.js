const poolQuery = require("../../../misc/poolQuery");

const getGroupDetailSaleReport = async(startDate, endDate, offset) => {
    const groupDetailSaleQuery = `
            SELECT 
                family_group.family_name,
                normal_menu_items.code_name,
                normal_menu_items.name,
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
            GROUP BY family_group.family_name, normal_menu_items.id
            ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""} ;`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];
    const groupDetailSaleDataRes = await poolQuery(groupDetailSaleQuery, variables);
    console.log('groupDetailReportRouter [getGroupDetailSaleReport] groupDetailSaleDataRes:', groupDetailSaleDataRes.rows);

    const totalGroupDetailSaleDataRes = await poolQuery(`
            SELECT 
                family_group.family_name,
                normal_menu_items.code_name,
                normal_menu_items.name,
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
            GROUP BY family_group.family_name, normal_menu_items.id;`, [startDate, endDate])
    console.log('groupDetailReportRouter [getGroupDetailSaleReport] totalGroupDetailSaleDataRes:', totalGroupDetailSaleDataRes.rows);
    return { groupDetailSaleReports: groupDetailSaleDataRes.rows, totalGroupDetailSaleReports: totalGroupDetailSaleDataRes.rows };
}

const getGroupSaleReport = async(startDate, endDate, offset) => {
    const groupSaleQuery = `
            SELECT 
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

    const totalGroupSaleDataRes = await poolQuery(`
            SELECT 
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
    return { groupSaleReports: groupSaleDataRes.rows, totalGroupSaleReports: totalGroupSaleDataRes.rows };
}

module.exports = { getGroupDetailSaleReport, getGroupSaleReport };