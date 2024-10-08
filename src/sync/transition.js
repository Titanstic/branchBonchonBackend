const poolQuery = require("../../misc/poolQuery");
const express = require("express");
const transitionRouter = express.Router();

const {fetchWithTimeOut} = require("../../misc/fetchApi");
const {PrintSlip} = require("../../printer/Print");

transitionRouter.post("/", async (req, res) => {
    try {
        const {id, rounding, payment_type_name, table_name, employee_id, employee_name, employee_printer, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, branch_id, dinner_table_id, add_on, inclusive, point, items, customer_count} = req.body.input;

        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');  // Pad single digits to two
        const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are zero-based, so add 1
        const year = date.toLocaleDateString('en', { year: "2-digit" });  // Get 2-digit year
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');  // Ensure 3 digits for milliseconds

        const orderNo = `${day}${month}${year}${hours}${minutes}${seconds}${milliseconds}`;

        // search sync data
        const branchResult = await findBranchById(branch_id);
        let branchData = [];
        if(branchResult.rows.length > 0){
            branchData = branchResult.rows[0];
        }

        await poolQuery('BEGIN');
        // insert transition
        const transitionResult = await addTransition(id, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, dinner_table_id, add_on, inclusive, point, employee_id, rounding, orderNo, customer_count);
        // insert transition item
        const { parsedItems, kitchenPrintItem, itemResults } = await transitionItems(id, items);
        transitionResult.items = JSON.stringify(itemResults);
        transitionResult.branch_id = branch_id;
        await poolQuery('COMMIT');

       //  printer state
        console.log("transitionRouter: kitchenPrintItem", kitchenPrintItem);
        await PrintSlip(employee_name, employee_printer, branchData, table_name, id, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, branch_id, dinner_table_id, add_on, inclusive, point, payment_type_name, orderNo, parsedItems, kitchenPrintItem);

        // Synchronous with online database
       await fetchOnlineDbTransition(transitionResult, id);
       //
        console.log("transitionRouter :", "Transition Successfully");
        res.json({ error: 0, message: transitionResult.id});
    } catch (e) {
        await poolQuery('ROLLBACK');
        console.error("transitionRouter error:", e.message);
        res.json({ error: 1, message: e.message });
    }
});

const findBranchById = async (id) => {
    return await poolQuery(`
        SELECT * FROM branches WHERE id = $1
    `, [id]);
};

const addTransition = async (
    id, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, dinner_table_id, add_on, inclusive, point, employee_id, rounding, orderNo, customer_count
) => {
    try {
        console.log("transitionRouter [addTransition]: ", orderNo);
        const result = await poolQuery(`
            INSERT INTO transactions(id, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, dinner_table_id, add_on, inclusive, point, employee_id, rounding, order_no, customer_count)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            RETURNING *;
        `, [
            id, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, dinner_table_id, add_on, inclusive, point, employee_id, rounding, orderNo, customer_count
        ]);

        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            throw new Error("No data returned after insert.");
        }
    } catch (e) {
        console.error("transitionRouter [addTransition] error: ", e.message);
        throw new Error(e.message);
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
}

const transitionItems = async (transition_id, items) => {
    const parsedItems = typeof items == "string" ? JSON.parse(items) : items;
    const kitchenPrintItem = [];
    const itemValue = [];

    for (const item of parsedItems) {
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
            console.log("transitionRouter [transitionItems]: comboMenuItems", comboMenuItems);
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

        // for multiple insert value
        // need change json parse
        itemValue.push([item.item_name, item.quantity, item.total_amount, item.price, item.is_take_away, item.note ? items.note : "", transition_id, item.normal_menu_item_id, item.container_charges, item.discount_price, JSON.stringify(item.flavour_types), item.combo_set_id, typeof comboMenuItems == "string" ? item.combo_menu_items : JSON.stringify(item.combo_menu_items)]);
    }

    const itemResults = await addTransitionItems(itemValue);
    return { parsedItems, kitchenPrintItem, itemResults };
}

const addTransitionItems = async (value) => {
        console.log("[Transition Routes] addTransitionItems : ", value);
        // Create the placeholders for the VALUES clause dynamically
        const valuePlaceholders = value.map((_, i) => `($${i * 13 + 1}, $${i * 13 + 2}, $${i * 13 + 3}, $${i * 13 + 4}, $${i * 13 + 5}, $${i * 13 + 6}, $${i * 13 + 7}, $${i * 13 + 8}, $${i * 13 + 9}, $${i * 13 + 10}, $${i * 13 + 11}, $${i * 13 + 12}, $${i * 13 + 13})`).join(', ');
        // Flatten the value array
        const flattenedValues = value.flat();

        const query = `
            INSERT INTO transaction_items(item_name, quantity, total_amount, price, is_take_away, note, transaction_id, normal_menu_item_id, container_charges, discount_price, flavour_types, combo_set_id, combo_menu_items)
            VALUES ${valuePlaceholders}
            RETURNING *;
        `;

        const result = await poolQuery(query, flattenedValues);

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            throw new Error("No data returned after insert.");
        }
}

const fetchOnlineDbTransition = async (data, id) => {
    await fetchWithTimeOut("onlineTransition", {timeout: 5000, method: "POST", body: JSON.stringify(data)})
        .then(res => res.json())
        .then(data => {
            console.log("[Transition Routes] fetchOnlineDbTransition : ", data);
            if(data.error === 0){
                updateTransition(id);
            }
        })
        .catch(error => {
            console.error("[Transition Routes] fetchOnlineDbTransition error : ", error.message);
            throw new Error(error.message);
        });
}

module.exports = transitionRouter;
