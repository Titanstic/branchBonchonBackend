const poolQuery = require("../../misc/poolQuery");

const addTransitionItems = async (value, comboSetValue) => {
    if(comboSetValue.length > 0){
        console.log("[Transition Routes] addTransitionItems comboSetValue: ", comboSetValue);
        const comboValuePlaceholders = comboSetValue.map((_, i) => `($${i * 10 + 1}, $${i * 10 + 2}, $${i * 10 + 3}, $${i * 10 + 4}, $${i * 10 + 5}, $${i * 10 + 6}, $${i * 10 + 7}, $${i * 10 + 8}, $${i * 10 + 9}, $${i * 10 + 10})`).join(', ');
        const comboValues = comboSetValue.flat();
        const transitionComboSetQuery = `
            INSERT INTO transaction_combo_set(id, combo_set_name, quantity, total_amount, price, is_take_away, transaction_id, container_charges, discount_price, combo_set_id)
            VALUES ${comboValuePlaceholders}
            RETURNING *;
        `;
        await poolQuery(transitionComboSetQuery, comboValues);
    }

    console.log("[Transition Routes] addTransitionItems value: ", value);
    // Create the placeholders for the VALUES clause dynamically
    const valuePlaceholders = value.map((_, i) => `($${i * 12 + 1}, $${i * 12 + 2}, $${i * 12 + 3}, $${i * 12 + 4}, $${i * 12 + 5}, $${i * 12 + 6}, $${i * 12 + 7}, $${i * 12 + 8}, $${i * 12 + 9}, $${i * 12 + 10}, $${i * 12 + 11}, $${i * 12 + 12})`).join(', ');
    // Flatten the value array
    const flattenedValues = value.flat();
    const query = `
            INSERT INTO transaction_items(item_name, quantity, total_amount, price, is_take_away, note, transaction_id, normal_menu_item_id, container_charges, discount_price, flavour_types, transition_combo_set_id)
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

module.exports = { addTransitionItems };