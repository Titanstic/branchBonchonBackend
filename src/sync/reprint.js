const poolQuery = require("../../misc/poolQuery");
const express = require("express");
const {PrintSlip} = require("../../printer/Print");
const ReprintRouter = express.Router();

ReprintRouter.post("/", async (req, res) => {
    const { transaction_id } = req.body.input;

    try{
        const transactionRes = await findTransactionAndEmployee(transaction_id);
        const branchRes = await findBranch(transactionRes.branch_id);

        const transactionItemRes =  await findTransactionItem(transaction_id);
        const {kitchenPrintItem, filterItem} = filterKitchenItem(transactionItemRes)

        await PrintSlip(transactionRes.employee_name, transactionRes.employee_printer, branchRes, transactionRes.table_name, transactionRes.id, transactionRes.grand_total_amount, transactionRes.sub_total_amount, transactionRes.tax_amount, transactionRes.service_charge_amount, transactionRes.discount_amount, transactionRes.discount_name, transactionRes.cash_back, transactionRes.payment, transactionRes.payment_type_id, transactionRes.branch_id, transactionRes.dinner_table_id, transactionRes.add_on, transactionRes.inclusive, transactionRes.point, transactionRes.payment_type_name, transactionRes.order_no, filterItem, kitchenPrintItem);

        res.json( {error: 0, message: transaction_id });
    }catch (e) {
        res.json( {error: 1, message: e.message });
    }
});

const findBranch = async (id) => {
    const result =  await poolQuery(`
        SELECT * FROM branches WHERE id = $1
    `, [id]);

    if(result.rows.length > 0) {
        return result.rows[0];
    }else{
        throw new Error("No Branch Data");
    }
}

const findTransactionAndEmployee = async (id) => {
    const result = await poolQuery(`
        SELECT 
            employees.username AS employee_name, 
            employees.printer_name AS employee_printer, 
            dinner_tables.table_no AS table_name, 
            transactions.id, 
            transactions.grand_total_amount, 
            transactions.sub_total_amount, 
            transactions.tax_amount, 
            transactions.service_charge_amount, 
            transactions.discount_amount, 
            transactions.discount_name, 
            transactions.cash_back, 
            transactions.payment, 
            transactions.payment_type_id, 
            transactions.branch_id,  
            transactions.dinner_table_id, 
            transactions.add_on, 
            transactions.inclusive, 
            transactions.point, 
            payment_types.payment_name AS payment_type_name, 
            transactions.order_no 
        FROM transactions
        LEFT JOIN employees ON transactions.employee_id = employees.id
        LEFT JOIN dinner_tables ON transactions.dinner_table_id = dinner_tables.id
        LEFT JOIN payment_types ON transactions.payment_type_id = payment_types.id
        WHERE transactions.id = $1`,
        [id]
    );

    if(result.rows.length > 0){
        return result.rows[0];
    }else{
        throw new Error("No transaction found for id");
    }
}

const findTransactionItem = async (transactionId) => {
    const itemRes = await poolQuery(`
        SELECT *, transaction_items.id FROM transaction_items
        LEFT JOIN menu_items on transaction_items.menu_item_id = menu_items.id
        LEFT JOIN kitchen ON menu_items.kitchen_id = kitchen.id
        WHERE transaction_id = $1
    `, [transactionId]);

    if(itemRes.rows.length > 0) {
        return itemRes.rows;
    }else{
        throw new Error("No transaction Item found for id");
    }
};

const filterKitchenItem = (items) => {
    const kitchenPrintItem = [];
    const filterItem = [];

    for (const item of items) {
        filterItem.push({...item, flavour_types: JSON.parse(item.flavour_types)});

        let haveIndex;
        kitchenPrintItem.forEach((each, index) => {
            if(each[0].printer_name === item.printer_name) {
                haveIndex = index
            }
        });

        if(haveIndex !== undefined){
            kitchenPrintItem[haveIndex].push({...item, flavour_types: JSON.parse(item.flavour_types)})
        }else{
            kitchenPrintItem.push([{...item, flavour_types: JSON.parse(item.flavour_types)}]);
        }
    }
    return { kitchenPrintItem, filterItem };
}

module.exports = ReprintRouter;