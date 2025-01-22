const poolQuery = require("../../../misc/poolQuery");

const getSummaryDataReport = async (startDate, endDate, offset) => {
    const query = `
            SELECT 
                SUM(t.grand_total_amount) AS grandTotal, 
                SUM(t.sub_total_amount) AS subTotal, 
                SUM(t.tax_amount) AS taxTotal, 
                SUM(t.service_charge_amount) AS serviceChargeTotal, 
                SUM(t.discount_amount) AS discountTotal,
                SUM(t.promotion_amount) AS promotionTotal,
                CASE SUM(td.amount) IS NOT NULL
                    WHEN TRUE THEN SUM(td.amount)
                END  AS totalAppDisAmount,
                DATE(t.created_at),
                COUNT(t.*) AS transactionCount
            FROM transactions AS t
            LEFT JOIN transaction_details AS td
                ON t.id = td.transaction_id
            WHERE t.void = false AND t.created_at BETWEEN $1 AND $2
            GROUP BY DATE(t.created_at)
            ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""} ;`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];
    const summaryDataRes = await poolQuery(query, variables)
    console.log('dailySaleReportRouter [getSummaryDataReport] summaryDataRes:', summaryDataRes.rows);

    const totalSummaryDataRes = await poolQuery(`
        SELECT
            SUM(t.grand_total_amount) AS grandTotal,
            SUM(t.sub_total_amount) AS subTotal,
            SUM(t.tax_amount) AS taxTotal,
            SUM(t.service_charge_amount) AS serviceChargeTotal,
            SUM(t.discount_amount) AS discountTotal,
            CASE SUM(td.amount) IS NOT NULL
                WHEN TRUE THEN SUM(td.amount)
            END  AS totalAppDisAmount,
            DATE(t.created_at),
            COUNT(t.*) AS transactionCount
        FROM transactions AS t
            LEFT JOIN transaction_details AS td
        ON t.id = td.transaction_id
        WHERE t.void = false AND t.created_at BETWEEN $1 AND $2
        GROUP BY DATE(t.created_at);`, [startDate, endDate])
    console.log('dailySaleReportRouter [getSummaryDataReport] totalSummaryDataRes:', totalSummaryDataRes.rows);
    return { summaryReports: summaryDataRes.rows, totalSummaryReports: totalSummaryDataRes.rows };
}

const getPaymentDataReport = async (startDate, endDate, offset) => {
    const query = `
        SELECT 
            SUM(transactions.grand_total_amount) AS grandTotal, 
            DATE(transactions.created_at) AS date, 
            payment_types.payment_name,
            COUNT(transactions.id) AS transactionCount
        FROM transactions
        LEFT JOIN payment_types
            ON transactions.payment_type_id = payment_types.id
        WHERE transactions.void = false AND transactions.created_at BETWEEN $1 AND $2
        GROUP BY DATE(transactions.created_at), payment_types.payment_name
        ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""} ;`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];
    const paymentDataRes = await poolQuery(query, variables);
    console.log('dailySaleReportRouter [getPaymentDataReport] paymentDataRes:', paymentDataRes.rows);

    const totalPaymentDataRes = await poolQuery(`
        SELECT 
            SUM(transactions.grand_total_amount) AS grandTotal, 
            DATE(transactions.created_at) AS date, 
            payment_types.payment_name,
            COUNT(transactions.id) AS transactionCount
        FROM transactions
        LEFT JOIN payment_types
        ON transactions.payment_type_id = payment_types.id
        WHERE transactions.void = false AND transactions.created_at BETWEEN $1 AND $2
        GROUP BY DATE(transactions.created_at), payment_types.payment_name`, [startDate, endDate]);
    console.log('dailySaleReportRouter [getPaymentDataReport] totalPaymentDataRes:', totalPaymentDataRes.rows);
    return { paymentReports: paymentDataRes.rows, totalPaymentReports: totalPaymentDataRes.rows };
}

const getDiscountDataReport = async (startDate, endDate, offset) => {
    const query = `
        SELECT 
            DATE(transaction_items.created_at),
            transaction_items.item_name,
            SUM(transaction_items.quantity * transaction_items.discount_price) AS grand_discount_amount
        FROM transaction_items
        LEFT JOIN transactions
            ON transaction_items.transaction_id = transactions.id
        WHERE transactions.void = false AND transaction_items.created_at BETWEEN $1 AND $2 AND transaction_items.discount_price > 0
        GROUP BY DATE(transaction_items.created_at), transaction_items.item_name
        ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""};`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];
    const discountDataRes = await poolQuery(query,variables);
    console.log('dailySaleReportRouter [getDiscountDataReport] discountDataRes:', discountDataRes.rows);

    const totalDiscountDataRes = await poolQuery(`
                SELECT
                    DATE(transaction_items.created_at),
                    transaction_items.item_name,
                    SUM(transaction_items.quantity * transaction_items.discount_price) AS grand_discount_amount
                FROM transaction_items
                LEFT JOIN transactions
                    ON transaction_items.transaction_id = transactions.id
                WHERE transactions.void = false AND transaction_items.created_at BETWEEN $1 AND $2 AND transaction_items.discount_price > 0
                GROUP BY DATE(transaction_items.created_at), transaction_items.item_name;`,
        [startDate, endDate]
    );
    console.log('dailySaleReportRouter [getDiscountDataReport] totalDiscountDataRes:', totalDiscountDataRes.rows);
    return { discountReports: discountDataRes.rows, totalDiscountReports: totalDiscountDataRes.rows };
}

const getPromotionDataReport = async (startDate, endDate, offset) => {
    const query = `
        SELECT 
            DATE(transactions.created_at),
            SUM(transactions.promotion_amount) AS grand_promotion_amount,
            promotion.name
        FROM transactions  
        LEFT JOIN promotion
            ON transactions.discount_name = promotion.name
        WHERE transactions.void = false AND transactions.created_at BETWEEN $1 AND $2  AND transactions.discount_name <> ''
        GROUP BY DATE(transactions.created_at), promotion.name
        ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""};`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];
    const promotionDataRes = await poolQuery(query,variables);
    console.log('dailySaleReportRouter [getPromotionDataReport] getPromotionDataReport:', promotionDataRes.rows);

    const totalPromotionDataRes = await poolQuery(`
        SELECT 
            DATE(transactions.created_at),
            SUM(transactions.promotion_amount) AS grand_promotion_amount,
            promotion.name
        FROM transactions  
        LEFT JOIN promotion
            ON transactions.discount_name = promotion.name
        WHERE transactions.void = false AND  transactions.created_at BETWEEN $1 AND $2  AND transactions.discount_name <> ''
        GROUP BY DATE(transactions.created_at), promotion.name;`,
        [startDate, endDate]
    );
    console.log('dailySaleReportRouter [getPromotionDataReport] totalPromotionDataRes:', totalPromotionDataRes.rows);
    return { promotionReports: promotionDataRes.rows, totalPromotionReports: totalPromotionDataRes.rows };
}

const getMenuDataReport = async (startDate, endDate, offset) => {
    const query = `
        SELECT 
            DATE(transaction_items.created_at),
            sum(transaction_items.total_amount) AS grandTotal,
            menu.menu_name,
            COUNT(transaction_items.id) AS transactionCount
        FROM transaction_items
        LEFT JOIN transactions
            ON transaction_items.transaction_id = transactions.id
        LEFT JOIN normal_menu_items
            ON transaction_items.normal_menu_item_id = normal_menu_items.id
        LEFT JOIN menu
            ON normal_menu_items.menu_id = menu.id
        WHERE  transactions.void = false AND transaction_items.created_at BETWEEN $1 AND $2
        GROUP BY DATE(transaction_items.created_at),menu.menu_name
        ${offset >= 0 ? "LIMIT 10 OFFSET $3" : ""};`;
    const variables = offset >= 0 ? [startDate, endDate, offset]: [startDate, endDate];
    const menuDataRes = await poolQuery(query,variables);
    console.log('dailySaleReportRouter [getMenuDataReport] getMenuDataReport:', menuDataRes.rows);

    const totalMenuDataRes = await poolQuery(`
        SELECT 
            DATE(transaction_items.created_at),
            sum(transaction_items.total_amount) AS grandTotal,
            menu.menu_name,
            COUNT(transaction_items.id) AS transactionCount
        FROM transaction_items
        LEFT JOIN transactions
            ON transaction_items.transaction_id = transactions.id
        LEFT JOIN normal_menu_items
            ON transaction_items.normal_menu_item_id = normal_menu_items.id
        LEFT JOIN menu
            ON normal_menu_items.menu_id = menu.id
        WHERE transactions.void = false AND transaction_items.created_at BETWEEN $1 AND $2
        GROUP BY DATE(transaction_items.created_at),menu.menu_name;`, [startDate, endDate]);
    console.log('dailySaleReportRouter [getMenuDataReport] totalMenuDataRes:', totalMenuDataRes.rows);
    return { menuReports: menuDataRes.rows, totalMenuReports: totalMenuDataRes.rows };
}

module.exports = { getSummaryDataReport, getPaymentDataReport, getDiscountDataReport, getPromotionDataReport, getMenuDataReport }