const poolQuery = require("../../misc/poolQuery");
const express = require("express");
const {PrintSlip} = require("../../printer/Print");
const ReprintRouter = express.Router();

ReprintRouter.post("/", async (req, res) => {
    const { transaction_id } = req.body.input;

    try{
        const transactionRes = await findTransactionAndEmployee(transaction_id);
        const branchRes = await findBranch();

        const transactionItemRes =  await findTransactionItem(transaction_id);
        const {kitchenPrintItem, filterItem} = filterKitchenItem(transactionItemRes);

        await PrintSlip(transactionRes.employee_name, transactionRes.employee_printer, branchRes, transactionRes.table_name, transactionRes.id, transactionRes.grand_total_amount, transactionRes.sub_total_amount, transactionRes.tax_amount, transactionRes.service_charge_amount, transactionRes.discount_amount, transactionRes.discount_name, transactionRes.cash_back, transactionRes.payment, transactionRes.payment_type_id, transactionRes.branch_id, transactionRes.dinner_table_id, transactionRes.add_on, transactionRes.inclusive, transactionRes.point, transactionRes.payment_type_name, transactionRes.order_no, filterItem, kitchenPrintItem);

        res.json( {error: 0, message: transaction_id });
    }catch (e) {
        res.json( {error: 1, message: e.message });
    }
});

const findBranch = async () => {
    const result =  await poolQuery(`SELECT * FROM branches `);

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
    const itemRes = [];

    const transitionItems = await poolQuery(`
        SELECT 
            kitchen.printer_name AS kitchen_printer, 
            transaction_items.normal_menu_item_id, 
            transaction_items.container_charges,  
            transaction_items.discount_price,  
            transaction_items.flavour_types,  
            transaction_items.is_take_away,
            transaction_items.item_name,
            transaction_items.note,
            transaction_items.price,
            transaction_items.quantity,
            transaction_items.total_amount
        FROM transaction_items
        LEFT JOIN normal_menu_items 
        ON transaction_items.normal_menu_item_id = normal_menu_items.id
        LEFT JOIN kitchen 
        ON normal_menu_items.kitchen_id = kitchen.id
        WHERE transaction_id = $1 AND transaction_items.transaction_id IS NOT NULL
    `, [transactionId]);

    if(transitionItems.rows.length > 0) {
        itemRes.push(...transitionItems.rows);
    }

    const transitionComboSet = await poolQuery(`
         SELECT 
            transaction_combo_set.id,
            transaction_combo_set.container_charges,  
            transaction_combo_set. discount_price,
            transaction_combo_set.is_take_away,
            transaction_combo_set.combo_set_name as item_name,
            transaction_combo_set.price,
            transaction_combo_set.quantity,
            transaction_combo_set.total_amount,
            transaction_combo_set.combo_set_id
        FROM transaction_combo_set
        WHERE transaction_id = $1;
    `, [transactionId]);

    if(transitionComboSet.rows.length > 0) {
        for (const eachComboSet of transitionComboSet.rows) {
            const comboSetTransitionItems =await poolQuery(`
                SELECT
                    kitchen.printer_name AS kitchen_printer,
                    transaction_items.normal_menu_item_id,
                    transaction_items.flavour_types,
                    transaction_items.is_take_away,
                    transaction_items.item_name,
                    transaction_items.note,
                    transaction_items.quantity
                FROM transaction_items
                LEFT JOIN normal_menu_items
                ON transaction_items.normal_menu_item_id = normal_menu_items.id
                LEFT JOIN kitchen
                ON normal_menu_items.kitchen_id = kitchen.id
                WHERE transaction_items.transition_combo_set_id = $1
            `, [eachComboSet.id]);

            eachComboSet.combo_menu_items = comboSetTransitionItems.rows;
        }

        itemRes.push(...transitionComboSet.rows);
    }

    if(itemRes.length > 0) {
        return itemRes;
    }else{
        throw new Error("No transaction Item found for id");
    }
};

const filterKitchenItem = (items) => {
    const kitchenPrintItem = [];
    const filterItem = [];

    for (const item of items) {
        filterItem.push({...item});

        if(item.normal_menu_item_id){
            let haveIndex;

            kitchenPrintItem.forEach((each, index) => {
                if(each[0].kitchen_printer === item.kitchen_printer) {
                    haveIndex = index
                }
            });

            if(haveIndex !== undefined){
                kitchenPrintItem[haveIndex].push(item);
            }else{
                kitchenPrintItem.push([item]);
            }

        }else{
            const comboMenuItems = typeof item.combo_menu_items == "string" ? JSON.parse(item.combo_menu_items) : item.combo_menu_items;
            comboMenuItems.forEach((eachCombo) => {
                let haveComboIndex;

                kitchenPrintItem.forEach((each, index) => {
                    if(each[0].kitchen_printer === eachCombo.kitchen_printer) {
                        haveComboIndex = index
                    }
                });

                if(haveComboIndex !== undefined){
                    kitchenPrintItem[haveComboIndex].push({...eachCombo, comboName: item.item_name});
                }else{
                    kitchenPrintItem.push([{...eachCombo, comboName: item.item_name}]);
                }
            })
        }
    }
    return { kitchenPrintItem, filterItem };
}

module.exports = ReprintRouter;