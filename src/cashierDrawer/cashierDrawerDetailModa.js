const poolQuery = require("../../misc/poolQuery");

const findDetailByCashierDrawerId = async (cashierDrawerId) => {
    const { rows: cashierDrawerDetails } = await poolQuery(`SELECT payment_type, sale_amount FROM cashier_drawer_details WHERE cashier_drawer_id = $1;`, [cashierDrawerId]);

    if(cashierDrawerDetails.length > 0) {
        console.log(`cashierDrawerController [findDetailByCashierDrawerId] cashierDrawerDetails: `, cashierDrawerDetails);
        return cashierDrawerDetails;
    }else {
        throw new Error("findDetailByCashierDrawerId does not exist");
    }
};

const findDetailByTwoId = async (morningId, eveningId) => {
    const { rows: cashierDrawerDetails } = await poolQuery(`
        SELECT payment_type, SUM(sale_amount) AS sale_amount 
        FROM cashier_drawer_details
        WHERE cashier_drawer_id = $1 OR id = $2
        GROUP BY payment_type
        ;`, [morningId, eveningId]);

    if(cashierDrawerDetails.length > 0) {
        console.log(`cashierDrawerController [findDetailByTwoId] cashierDrawerDetails: `, cashierDrawerDetails);
        return cashierDrawerDetails;
    }else {
        throw new Error("findDetailByTwoId does not exist");
    }
};

const findDetailByDate = async (date) => {
    const { rows: cashierDrawerDetails } = await poolQuery(`
        SELECT cashier_drawer_details.payment_type, SUM(cashier_drawer_details.sale_amount) AS sale_amount 
        FROM cashier_drawer_details
        LEFT JOIN cashier_drawer
        ON cashier_drawer_details.cashier_drawer_id = cashier_drawer.id
        WHERE cashier_drawer.pick_up_date_time IS NOT NULL AND cashier_drawer.finished = true AND DATE(cashier_drawer.created_at) = $1
        GROUP BY cashier_drawer_details.payment_type;`,
        [date]
    );

    if(cashierDrawerDetails.length > 0) {
        console.log(`cashierDrawerController [findDetailByDate] cashierDrawerDetails: `, cashierDrawerDetails);
        return cashierDrawerDetails;
    }else {
        throw new Error("findDetailByTwoDate does not exist");
    }
};

module.exports = { findDetailByCashierDrawerId, findDetailByTwoId, findDetailByDate };