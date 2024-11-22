const poolQuery = require("../../../misc/poolQuery");
const {calculateDrawerAmount} = require("../../utils/cashierDrawer");
const {updateDrawerDetail} = require("./cashierDrawerDetailModel");

const findCashierDrawerByTodayDate = async (pos_ip_address) => {
    const { rows: currentCashierDrawerData } = await poolQuery(`
        SELECT * FROM cashier_drawer 
        WHERE DATE(created_at) = CURRENT_DATE AND pick_up_date_time IS NULL AND pos_ip_address = $1;
        `, [pos_ip_address]
    );

    if(currentCashierDrawerData.length === 0){
        throw  new Error("Cashier Drawer Not found in current date");
    }

    return currentCashierDrawerData[0];
}

const createCashierDrawer = async (posIpAddress, opening_cash, employee_id) => {
    const { rows: cashierDrawerData } = await poolQuery(`
        INSERT INTO cashier_drawer(opening_cash, opening_employee_id, pos_ip_address, cash_in_drawer) 
        VALUES($1, $2, $3, $4) RETURNING *`,
        [opening_cash, employee_id, posIpAddress, opening_cash]
    );

    if(cashierDrawerData.length > 0 ){
        console.log(`cashierDrawerModal [createCashierDrawer] cashierDrawerData: `, cashierDrawerData);
        return { cashierDrawerData };
    }else{
        throw new Error("cashierDrawerModal [createCashierDrawer] error: create in cashierDrawer")
    }
};

const addCashierDrawer = async (grand_total_amount, payment_type_name, sub_total_amount, add_on, tax_amount, rounding, parsedItems, pos_ip_address, customer_count, promotion = 0, discount) => {
    const { rows: currentCashierDrawerData } = await poolQuery(`
        SELECT * FROM cashier_drawer 
        WHERE DATE(created_at) = CURRENT_DATE AND pick_up_date_time IS NULL AND pos_ip_address = $1;
        `, [pos_ip_address]
    );

    if(currentCashierDrawerData.length > 0){
        console.log("transitionRouter [addCashierDrawer] currentCashierDrawerData:", currentCashierDrawerData);
        // find payment type [self or delivery]
        const { rows: paymentTypeRes } = await poolQuery(`SELECT type FROM payment_types WHERE payment_name = $1;`, [payment_type_name]);

        const { setCashierDrawerData } = calculateDrawerAmount(currentCashierDrawerData[0], grand_total_amount, payment_type_name, sub_total_amount, add_on, tax_amount, rounding, parsedItems, paymentTypeRes[0].type, customer_count, promotion, discount);
        const updateCashierDrawerQuery = `UPDATE cashier_drawer ${setCashierDrawerData} WHERE id = $1;`
        await poolQuery(updateCashierDrawerQuery, [currentCashierDrawerData[0].id]);

        await updateDrawerDetail(grand_total_amount, payment_type_name, currentCashierDrawerData[0].id)
    }else {
        throw new Error("transitionRouter [addCashierDrawer] error: currentCashierDrawerData doesn't found by pos_ip_address");
    }

};

const findCashierDrawerByTwoId = async (morningId, eveningId) => {
    const { rows: cashierDrawerData } = await poolQuery(`
        SELECT 
            DATE(created_at) AS date,
            SUM(net_sales) AS net_sales,
            SUM(tax_add_on) AS tax_add_on, 
            SUM(CAST(rounding AS INTEGER)) AS rounding,
            SUM(total_revenue) AS total_revenue,
            SUM(void) AS void,
            SUM(opening_cash) AS opening_cash,
            SUM(cash_sale) AS cash_sale,
            SUM(pick_up) AS pick_up,
            SUM(cash_in_drawer) AS cash_in_drawer,
            SUM(die_in) AS die_in,
            SUM(self_take_away) AS self_take_away,
            SUM(delivery) AS delivery,
            SUM(guest_count) AS guest_count,
            SUM(total_revenue_count) AS total_revenue_count,
            SUM(void_count) AS void_count
        FROM cashier_drawer 
        WHERE pick_up_date_time IS NOT NULL AND finished = true AND id = $1 OR id = $2
        GROUP BY DATE(created_at)
        `, [morningId, eveningId]);

    if(cashierDrawerData.length > 0 ){
        console.log(`cashierDrawerController [findCashierDrawerByTwoId] cashierDrawerData: `, cashierDrawerData[0]);
        return cashierDrawerData[0];
    }else{
        throw new Error("cashierDrawerData does not exist By Two Id");
    }
};

const  findCashierDrawerByDate = async (date) => {
    const { rows: cashierDrawerData } = await poolQuery(`
        SELECT 
            DATE(created_at) AS date,
            SUM(net_sales) AS net_sales,
            SUM(tax_add_on) AS tax_add_on, 
            SUM(CAST(rounding AS INTEGER)) AS rounding,
            SUM(total_revenue) AS total_revenue,
            SUM(void) AS void,
            SUM(opening_cash) AS opening_cash,
            SUM(cash_sale) AS cash_sale,
            SUM(pick_up) AS pick_up,
            SUM(cash_in_drawer) AS cash_in_drawer,
            SUM(die_in) AS die_in,
            SUM(self_take_away) AS self_take_away,
            SUM(delivery) AS delivery,
            SUM(guest_count) AS guest_count,
            SUM(total_revenue_count) AS total_revenue_count,
            SUM(void_count) AS void_count
        FROM cashier_drawer 
        WHERE pick_up_date_time IS NOT NULL AND finished = true AND DATE(created_at) = $1
        GROUP BY DATE(created_at)
        `, [date]);

    if(cashierDrawerData.length > 0 ){
        console.log(`cashierDrawerController [findCashierDrawerByDate] cashierDrawerData: `, cashierDrawerData[0]);
        return cashierDrawerData[0];
    }else{
        throw new Error("cashierDrawerData does not exist by date");
    }
}

const findCashierDrawerById = async (id) => {
    const { rows: cashierDrawerData } = await poolQuery(`
        SELECT 
            cashier_drawer.total_amount,
            cashier_drawer.discount,
            cashier_drawer.promotion,
            cashier_drawer.net_sales,
            cashier_drawer.tax_add_on, 
            cashier_drawer.rounding,
            cashier_drawer.total_revenue,
            cashier_drawer.void,
            cashier_drawer.opening_cash,
            cashier_drawer.cash_sale,
            cashier_drawer.pick_up,
            cashier_drawer.cash_in_drawer,
            cashier_drawer.die_in,
            cashier_drawer.self_take_away,
            cashier_drawer.delivery,
            cashier_drawer.guest_count,
            cashier_drawer.total_revenue_count,
            cashier_drawer.void_count,
            pickUpEmployee.username AS pickEmployeeName,
            pickUpEmployee.printer_name,
            openingEmployee.username AS openEmployeeName
        FROM cashier_drawer 
        LEFT JOIN employees AS pickUpEmployee
        ON cashier_drawer.pick_employee_id = pickUpEmployee.id
        LEFT JOIN employees AS openingEmployee
        ON cashier_drawer.opening_employee_id = openingEmployee.id
        WHERE cashier_drawer.id = $1;
        `, [id]);

    if(cashierDrawerData.length > 0){
        console.log(`cashierDrawerController [findCashierDrawerById] cashierDrawerData: `, cashierDrawerData[0]);
        return cashierDrawerData[0];
    }else{
        throw new Error("cashierDrawerData does not found by id ");
    }
};

const updateCashierDrawerById = async (cashierDrawerId, setCashierDrawerData) => {
    const query = `
        UPDATE cashier_drawer
        ${setCashierDrawerData}
        WHERE id = $1;
    `

    const { rowCount } = await poolQuery(query, [cashierDrawerId]);

    if(rowCount === 0){
        throw new Error(`Update cashier drawer error`);
    }
}

module.exports = { findCashierDrawerByTodayDate, createCashierDrawer, addCashierDrawer, findCashierDrawerByTwoId, findCashierDrawerByDate, findCashierDrawerById, updateCashierDrawerById }