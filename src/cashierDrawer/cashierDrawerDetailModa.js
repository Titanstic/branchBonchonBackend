const poolQuery = require("../../misc/poolQuery");

const findDetailByCashierDrawerId = async (cashierDrawerId) => {
    const { rows: cashierDrawerDetails } = await poolQuery(`SELECT payment_type, sale_amount FROM cashier_drawer_details WHERE cashier_drawer_id = $1;`, [cashierDrawerId]);
    console.log(`cashierDrawerController [findDetailByCashierDrawerId] cashierDrawerDetails: `, cashierDrawerDetails);

    return cashierDrawerDetails;
};

const findDetailByGroupBy = async (cashierDrawerId) => {
    const { rows: cashierDrawerDetails } = await poolQuery(`SELECT payment_type, SUM(sale_amount) AS sale_amount FROM cashier_drawer_details WHERE cashier_drawer_id = $1;`, [cashierDrawerId]);
    console.log(`cashierDrawerController [findDetailByGroupBy] cashierDrawerDetails: `, cashierDrawerDetails);
    return cashierDrawerDetails;
};

module.exports = { findDetailByCashierDrawerId };