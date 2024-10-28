const poolQuery = require("../../misc/poolQuery");


const createCashierDrawer = async (posIpAddress, opening_cash, employee_id) => {
    const { rows: cashierDrawerData } = await poolQuery(`INSERT INTO cashier_drawer(opening_cash, employee_id, pos_ip_address) VALUES($1, $2, $3) RETURNING *`, [opening_cash, employee_id, posIpAddress]);
    if(cashierDrawerData.length > 0 ){
        console.log(`cashierDrawerModal [createCashierDrawer] cashierDrawerData: `, cashierDrawerData);
        return { cashierDrawerData };
    }else{
        throw new Error("cashierDrawerModal [createCashierDrawer] error: create in cashierDrawer")
    }
}

module.exports = { createCashierDrawer }