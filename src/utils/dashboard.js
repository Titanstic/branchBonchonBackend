const dashboardQuery = (type) => {
    let whereCondition = "";
    switch (type) {
        case "daily":
            whereCondition = `= CURRENT_DATE`
            break;
        case "weekly":
            const { convertStartDate, convertEndDate } = getStartAndEndOfWeek();
            whereCondition = `BETWEEN '${convertStartDate}' AND '${convertEndDate}'`
            break;
        case "monthly":
            const { firstDate, lastDate} = getFirstAndLastDateOfMonth();
            whereCondition = `BETWEEN '${firstDate}' AND '${lastDate}'`
            break;
    }

    const dieInTakeAwayQuery = `
        SELECT 
            SUM(total_amount + container_charges) AS grand_total_amount,
            CASE 
                WHEN is_take_away = true THEN 'takeaway'
                ELSE 'dine_in'
            END AS type
        FROM transaction_items
        WHERE DATE(created_at) ${whereCondition}
        GROUP BY is_take_away;
    `;

    const deliveryAndTotalRevQuery = `
        SELECT 
            SUM(grand_total_amount) AS total_revenue,
            payment_types.type
        FROM transactions
        LEFT JOIN payment_types
            ON transactions.payment_type_id = payment_types.id
        WHERE DATE(transactions.created_at) ${whereCondition}
        GROUP BY payment_types.type 
            HAVING payment_types.type IN ('self', 'delivery')
    `;

    const besetSellerItemQuery = `
        SELECT 
            item_name, 
            quantity, 
            total_amount
        FROM (
            SELECT 
                item_name,
                SUM(quantity) AS quantity,
                SUM(total_amount) AS total_amount,
                ROW_NUMBER() OVER (ORDER BY SUM(quantity) DESC) AS row_num
            FROM transaction_items
            WHERE DATE(created_at) ${whereCondition}
            GROUP BY item_name
        ) AS ranked_items
        WHERE row_num <= 10;
    `;

    return { dieInTakeAwayQuery, deliveryAndTotalRevQuery, besetSellerItemQuery };
}


const getStartAndEndOfWeek = (date = new Date()) => {
    // startDay = 0 for Sunday or 1 for Monday as the start of the week
    const currentDate = new Date(date);
    const startDate = new Date();
    const endDate = new Date();

    const startDay = currentDate.getDay();
    const startDiff = currentDate.getDate() - startDay + (startDay === 0 ? -6 : 0);
    startDate.setDate(startDiff);

    const endDay = 6 - currentDate.getDay();
    const endDiff = currentDate.getDate() + endDay;
    endDate.setDate(endDiff);

    const convertStartDate = startDate.toLocaleDateString("en-US");
    const convertEndDate = endDate.toLocaleDateString("en-US");
    return { convertStartDate, convertEndDate };
};

const  getFirstAndLastDateOfMonth = () => {
    const today = new Date();
    // month is 0-indexed (0 = January, 11 = December)
    const firstDate = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString("en-US");
    const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toLocaleDateString("en-US"); // Setting day to 0 gives the last day of the previous month

    return {firstDate, lastDate};
}


module.exports = { dashboardQuery, getStartAndEndOfWeek }
