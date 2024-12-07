const poolQuery = require("../../../misc/poolQuery");

const findTransactionById = async (transactionId) => {
    const { rows: transactionData } = await poolQuery(`
        SELECT * FROM transactions 
        WHERE id = $1;
        `, [transactionId]
    );

    if(transactionData.length === 0){
        throw  new Error("Cashier Drawer Not found in current date");
    }

    return transactionData[0];
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
            transactions.order_no,
            transactions.promotion_amount,
            transactions.void,
            transactions.cashier_drawer_id
        FROM transactions
        LEFT JOIN employees ON transactions.employee_id = employees.id
        LEFT JOIN dinner_tables ON transactions.dinner_table_id = dinner_tables.id
        LEFT JOIN payment_types ON transactions.payment_type_id = payment_types.id
        WHERE transactions.id = $1`,
        [id]
    );

    if(result.rows.length > 0){
        console.log("transactionModel [findTransactionAndEmployee] :", result.rows[0]);
        return result.rows[0];
    }else{
        throw new Error("No transaction found for id");
    }
};

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

const addTransition = async (id, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, dinner_table_id, add_on, inclusive, point, employee_id, rounding, orderNo, customer_count, promotion = 0, cashierDrawerId) => {
    console.log("transitionRouter [addTransition]: ", orderNo);
    const result = await poolQuery(`
            INSERT INTO transactions(id, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, dinner_table_id, add_on, inclusive, point, employee_id, rounding, order_no, customer_count, promotion_amount, cashier_drawer_id)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            RETURNING *;
        `, [
        id, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, dinner_table_id, add_on, inclusive, point, employee_id, rounding, orderNo, customer_count, promotion, cashierDrawerId
    ]);

    if (result.rows.length > 0) {
        console.log("dfdfdfdfdf-------", result.rows[0])
        return result.rows[0];
    } else {
        throw new Error("transitionRouter [addTransition] error: No data returned after insert.");
    }
}

const updateTransition = async (id) => {
    try{
        await poolQuery(`
            UPDATE transactions
            SET sync = true
            WHERE id = $1
        `, [id]);
    }catch (e){
        console.log(e.message);
        throw new Error(e.message);
    }
};

const findOrderNo = async () => {
    const transitionOrderRes = await poolQuery(`SELECT order_no FROM transactions WHERE DATE(created_at) = CURRENT_DATE ORDER BY  created_at DESC LIMIT 1;`);
    return transitionOrderRes.rows.length > 0 ? `${Number(transitionOrderRes.rows[0].order_no) + 1}` : "1000";
}

const updateTransactionVoidById = async (transactionId) => {
    const { rowCount } = await poolQuery(`
        UPDATE transactions
        SET void = true
        WHERE id = $1;
    `, [transactionId]);

    if(rowCount === 0){
        throw new Error(`updateTransactionVoidById error`);
    }
    console.log(`tranasctionModel [updateTransactionVoidById] rowCount: `, rowCount);
}
module.exports = { findTransactionById, findTransactionAndEmployee, findTransactionItem, addTransition, updateTransition, findOrderNo, updateTransactionVoidById };