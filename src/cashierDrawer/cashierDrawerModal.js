const poolQuery = require("../../misc/poolQuery");


const createCashierDrawer = async (posIpAddress, opening_cash, employee_id) => {
    const { rows: cashierDrawerData } = await poolQuery(`INSERT INTO cashier_drawer(opening_cash, opening_employee_id, pos_ip_address, cash_in_drawer) VALUES($1, $2, $3, $4) RETURNING *`, [opening_cash, employee_id, posIpAddress, opening_cash]);
    if(cashierDrawerData.length > 0 ){
        console.log(`cashierDrawerModal [createCashierDrawer] cashierDrawerData: `, cashierDrawerData);
        return { cashierDrawerData };
    }else{
        throw new Error("cashierDrawerModal [createCashierDrawer] error: create in cashierDrawer")
    }
}

module.exports = { createCashierDrawer }