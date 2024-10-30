const poolQuery = require("../../../misc/poolQuery");

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

    const totalSummaryDataRes = await poolQuery(`SELECT sum(grand_total_amount) AS grandTotal, 
            sum(sub_total_amount) AS subTotal, 
            sum(tax_amount) AS taxTotal, 
            sum(service_charge_amount) AS serviceChargeTotal, sum(discount_amount) AS discountTotal,
            DATE(created_at),
            COUNT(*) AS transactionCount
            FROM transactions 
            WHERE created_at BETWEEN $1 AND $2
            GROUP BY DATE(created_at);`, [startDate, endDate])
    console.log('dailySaleReportRouter [getSummaryDataReport] totalSummaryDataRes:', totalSummaryDataRes.rows);
    return { summaryReports: summaryDataRes.rows, totalSummaryReports: totalSummaryDataRes.rows };
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
    console.log('dailySaleReportRouter [getPaymentDataReport] paymentDataRes:', paymentDataRes.rows);

    const totalPaymentDataRes = await poolQuery(`SELECT sum(transactions.grand_total_amount) AS grandTotal, DATE(transactions.created_at) AS date, payment_types.payment_name,COUNT(transactions.id) AS transactionCount
        FROM transactions
        LEFT JOIN payment_types
        ON transactions.payment_type_id = payment_types.id
        WHERE transactions.created_at BETWEEN $1 AND $2
        GROUP BY DATE(transactions.created_at), payment_types.payment_name`, [startDate, endDate]);
    console.log('dailySaleReportRouter [getPaymentDataReport] totalPaymentDataRes:', totalPaymentDataRes.rows);
    return { paymentReports: paymentDataRes.rows, totalPaymentReports: totalPaymentDataRes.rows };
}

const getDiscountDataReport = async (startDate, endDate, offset) => {
    // const query = `SELECT sum(grand_total_amount) AS grandTotal,
    //     DATE(created_at) AS date,
    //     discount_name,
    //     COUNT(*) AS transactionCount
    //     FROM transactions
    //     WHERE created_at BETWEEN $1 AND $2
    //     AND discount_name != ''
    //     GROUP BY DATE(created_at), discount_name
    //     ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""};`;
    // const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];
    // const discountDataRes = await poolQuery(query,variables);
    // console.log('dailySaleReportRouter [getDiscountDataReport] discountDataRes:', discountDataRes.rows);
    //
    // const totalDiscountDataRes = await poolQuery(`SELECT sum(grand_total_amount) AS grandTotal,
    //     DATE(created_at) AS date,
    //     discount_name,
    //     COUNT(*) AS transactionCount
    //     FROM transactions
    //     WHERE created_at BETWEEN $1 AND $2
    //     AND discount_name != ''
    //     GROUP BY DATE(created_at), discount_name;`, [startDate, endDate]);
    // console.log('dailySaleReportRouter [getDiscountDataReport] totalDiscountDataRes:', totalDiscountDataRes.rows);

    const query = `
        SELECT 
            SUM(discount_price) AS grand_discount_price,
            DATE(created_at) AS date
        FROM transaction_items
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY DATE(created_at)
        ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""};`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];
    const discountDataRes = await poolQuery(query,variables);
    console.log('dailySaleReportRouter [getDiscountDataReport] discountDataRes:', discountDataRes.rows);

    const totalDiscountDataRes = await poolQuery(`
        SELECT 
            sum(discount_price) AS grand_discount_price,
            DATE(created_at) AS date
        FROM transaction_items
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY DATE(created_at);`, [startDate, endDate]);
    console.log('dailySaleReportRouter [getDiscountDataReport] totalDiscountDataRes:', totalDiscountDataRes.rows);
    return { discountReports: discountDataRes.rows, totalDiscountReports: totalDiscountDataRes.rows };
}

const getPromotionDataReport = async (startDate, endDate, offset) => {
    // const query = `SELECT DATE(transaction_items.created_at),
    //     sum(transaction_items.total_amount) AS grandTotal,
    //     promotion.name,
    //     COUNT(transaction_items.id) AS transactionCount
    //     FROM transaction_items
    //     LEFT JOIN promotion_items
    //     ON transaction_items.normal_menu_item_id = promotion_items.normal_menu_item_id
    //     LEFT JOIN promotion
    //     ON promotion_items.promotion_id = promotion.id
    //     WHERE transaction_items.created_at BETWEEN $1 AND $2
    //     GROUP BY DATE(transaction_items.created_at), promotion.name
    //     ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""};`;
    // const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];
    // const promotionDataRes = await poolQuery(query,variables);
    // console.log('dailySaleReportRouter [getPromotionDataReport] getPromotionDataReport:', promotionDataRes.rows);
    //
    // const totalPromotionDataRes = await poolQuery(`SELECT DATE(transaction_items.created_at),
    //     sum(transaction_items.total_amount) AS grandTotal,
    //     promotion.name,
    //     COUNT(transaction_items.id) AS transactionCount
    //     FROM transaction_items
    //     LEFT JOIN promotion_items
    //     ON transaction_items.normal_menu_item_id = promotion_items.normal_menu_item_id
    //     LEFT JOIN promotion
    //     ON promotion_items.promotion_id = promotion.id
    //     WHERE transaction_items.created_at BETWEEN $1 AND $2
    //     GROUP BY DATE(transaction_items.created_at), promotion.name`, [startDate, endDate]);
    // console.log('dailySaleReportRouter [getPromotionDataReport] totalPromotionDataRes:', totalPromotionDataRes.rows);

    const query = `
        SELECT 
            DATE(transaction_items.created_at),
            SUM(transaction_items.discount_price) AS items_discount,
            SUM(transactions.discount_amount) AS transaction_discount_promotion,
            promotion.name
        FROM transaction_items  
        LEFT JOIN transactions
            ON transaction_items.transaction_id = transactions.id
        LEFT JOIN promotion_items
            ON transaction_items.normal_menu_item_id = promotion_items.normal_menu_item_id
        LEFT JOIN promotion
            ON promotion_items.promotion_id = promotion.id
        WHERE transaction_items.created_at BETWEEN $1 AND $2
        GROUP BY DATE(transaction_items.created_at), promotion.name
        ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""};`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];
    const promotionDataRes = await poolQuery(query,variables);
    console.log('dailySaleReportRouter [getPromotionDataReport] getPromotionDataReport:', promotionDataRes.rows);

    const totalPromotionDataRes = await poolQuery(`
        SELECT 
            DATE(transaction_items.created_at),
            SUM(transaction_items.discount_price) AS items_discount,
            SUM(transactions.discount_amount) AS transaction_discount_promotion,
            promotion.name
        FROM transaction_items 
         LEFT JOIN transactions
            ON transaction_items.transaction_id = transactions.id
        LEFT JOIN promotion_items
            ON transaction_items.normal_menu_item_id = promotion_items.normal_menu_item_id
        LEFT JOIN promotion
            ON promotion_items.promotion_id = promotion.id
        WHERE transaction_items.created_at BETWEEN $1 AND $2
        GROUP BY DATE(transaction_items.created_at), promotion.name`, [startDate, endDate]);
    console.log('dailySaleReportRouter [getPromotionDataReport] totalPromotionDataRes:', totalPromotionDataRes.rows);
    return { promotionReports: promotionDataRes.rows, totalPromotionReports: totalPromotionDataRes.rows };
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
    console.log('dailySaleReportRouter [getMenuDataReport] getMenuDataReport:', menuDataRes.rows);

    const totalMenuDataRes = await poolQuery(`SELECT 
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
        GROUP BY DATE(transaction_items.created_at),menu.menu_name;`, [startDate, endDate]);
    console.log('dailySaleReportRouter [getMenuDataReport] totalMenuDataRes:', totalMenuDataRes.rows);
    return { menuReports: menuDataRes.rows, totalMenuReports: totalMenuDataRes.rows };
}

module.exports = { getSummaryDataReport, getPaymentDataReport, getDiscountDataReport, getPromotionDataReport, getMenuDataReport }