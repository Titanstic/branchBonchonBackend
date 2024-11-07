const poolQuery = require("../../misc/poolQuery");
const express = require("express");

const transactionController = express.Router();

const {PrintSlip} = require("../../printer/Print");
const {findOrderNo, addTransition, updateTransition, findTransactionAndEmployee, findTransactionItem} = require("../models/transactionModel");
const {findBranchById, findBranch} = require("../models/branchModel");
const {addCashierDrawer} = require("../models/cashierDrawer/cashierDrawerModel");
const {fetchOnlineDbTransition, filterKitchenItem, transitionItems} = require("../utils/transaction");

transactionController.post("/", async (req, res) => {
    try {
        const {id, rounding, payment_type_name, table_name, employee_id, employee_name, employee_printer, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, branch_id, dinner_table_id, add_on, inclusive, point, items, customer_count, pos_ip_address, promotion} = req.body.input ? req.body.input : req.body;

        const orderNo = await findOrderNo();
        console.log("transitionRouter order NO:", orderNo);

        await poolQuery('BEGIN');
        // insert transition
        const transitionResult = await addTransition(id, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, dinner_table_id, add_on, inclusive, point, employee_id, rounding, orderNo, customer_count, promotion);
        // insert transition item
        const { parsedItems, kitchenPrintItem, itemResults } = await transitionItems(id, items);
        transitionResult.items = JSON.stringify(itemResults);
        transitionResult.branch_id = branch_id;
        // insert cashier drawer
        await addCashierDrawer(grand_total_amount, payment_type_name, sub_total_amount, add_on, tax_amount, rounding, parsedItems, pos_ip_address, customer_count, promotion, discount_amount);
        await poolQuery('COMMIT');

       //  printer state
        // search sync data
        const branchResult = await findBranchById(branch_id);
        let branchData = [];
        if(branchResult.rows.length > 0){
            branchData = branchResult.rows[0];
        }
         await PrintSlip(employee_name, employee_printer, branchData, table_name, id, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, branch_id, dinner_table_id, add_on, inclusive, point, payment_type_name, orderNo, parsedItems, kitchenPrintItem);
       //
       //  // Synchronous with online database
       await fetchOnlineDbTransition(transitionResult);

        console.log("transitionRouter :", "Transition Successfully");
        res.json({ error: 0, message: transitionResult.id});
    } catch (e) {
        await poolQuery('ROLLBACK');
        console.error("transitionRouter error:", e.message);
        res.json({ error: 1, message: e.message });
    }
});

transactionController.post("/reprint", async (req, res) => {
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

module.exports = transactionController;
