const poolQuery = require("../../../misc/poolQuery");

const findDetailByCashierDrawerId = async (cashierDrawerId) => {
    const { rows: cashierDrawerDetails } = await poolQuery(`
        SELECT 
            id, 
            payment_type, 
            sale_amount 
        FROM cashier_drawer_details 
        WHERE cashier_drawer_id = $1;
    `, [cashierDrawerId]);

    if(cashierDrawerDetails.length > 0) {
        console.log(`cashierDrawerController [findDetailByCashierDrawerId] cashierDrawerDetails: `, cashierDrawerDetails);
        return cashierDrawerDetails;
    }else {
        throw new Error("findDetailByCashierDrawerId does not exist");
    }
};

const findDetailByCashierDrawerIdAndType = async (cashierDrawerId, payment_type) => {
    console.log(cashierDrawerId);
    const { rows: cashierDrawerDetails } = await poolQuery(`
        SELECT 
            id, 
            payment_type, 
            sale_amount 
        FROM cashier_drawer_details 
        WHERE cashier_drawer_id = $1 AND payment_type = $2;
        `, [cashierDrawerId, payment_type]);

    if(cashierDrawerDetails.length > 0) {
        console.log(`cashierDrawerController [findDetailByCashierDrawerIdAndType] cashierDrawerDetails: `, cashierDrawerDetails[0]);
        return cashierDrawerDetails[0];
    }else {
        throw new Error("findDetailByCashierDrawerIdAndType does not exist by id");
    }
};

const findDetailByTwoId = async (morningId, eveningId) => {
    const { rows: cashierDrawerDetails } = await poolQuery(`
        SELECT 
            payment_type, 
            SUM(sale_amount) AS sale_amount 
        FROM cashier_drawer_details
        WHERE cashier_drawer_id = $1 OR cashier_drawer_id = $2
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

const updateDrawerDetail = async (grand_total_amount, payment_type_name, cashierDrawerId) => {
    try {
        const { rows: cashierDrawerDetails } = await poolQuery(`SELECT * FROM cashier_drawer_details WHERE payment_type = $1 AND cashier_drawer_id = $2;`, [payment_type_name, cashierDrawerId]);
        console.log("transitionRouter [calculateDrawerDetail] cashierDrawerDetails:", cashierDrawerDetails);
        if(cashierDrawerDetails.length > 0){
            cashierDrawerDetails[0].sale_amount += grand_total_amount;
            await poolQuery(`UPDATE cashier_drawer_details SET sale_amount = $1 WHERE id = $2;`, [cashierDrawerDetails[0].sale_amount, cashierDrawerDetails[0].id]);
        }else{
            await poolQuery(`INSERT INTO cashier_drawer_details(payment_type, sale_amount, cashier_drawer_id) VALUES($1, $2, $3);`, [payment_type_name, grand_total_amount, cashierDrawerId]);
        }
    }catch (e){
        throw new Error(`transitionRouter [calculateDrawerDetail] error: ${e.message}`);
    }
}

const updateCashierDrawerDetailsById = async (id, amount) => {
    const { rowCount } = await poolQuery(`
        UPDATE cashier_drawer_details
        SET sale_amount = $1
        WHERE id = $2;`,
        [amount, id]);

    if(rowCount === 0){
        throw  new Error(`Update Cashier Drawer Detail By id`)
    }
};

const deleteCashierDrawerDetailsById = async (id) => {
    const { rowCount } = await poolQuery(`DELETE FROM cashier_drawer_details WHERE id = $1;`, [id]);

    if(rowCount === 0){
        throw  new Error(`Delete Cashier Drawer Detail By id`)
    }
}
module.exports = { findDetailByCashierDrawerId, findDetailByCashierDrawerIdAndType, findDetailByTwoId, findDetailByDate, updateDrawerDetail, updateCashierDrawerDetailsById, deleteCashierDrawerDetailsById };