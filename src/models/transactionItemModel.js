const poolQuery = require("../../misc/poolQuery");

const findTransactionItemsByTransactionId = async (transactionId) => {
    const { rows: transactionItemData } = await poolQuery(`
        SELECT * FROM transaction_items 
        WHERE transaction_id = $1;
        `, [transactionId]
    );

    return transactionItemData;
}

const addTransitionItems = async (value, comboSetValue) => {
    let result = [];

    if(comboSetValue.length > 0){
        console.log("[Transition Routes] addTransitionItems comboSetValue: ", comboSetValue);
        const comboValuePlaceholders = comboSetValue.map((_, i) => `($${i * 10 + 1}, $${i * 10 + 2}, $${i * 10 + 3}, $${i * 10 + 4}, $${i * 10 + 5}, $${i * 10 + 6}, $${i * 10 + 7}, $${i * 10 + 8}, $${i * 10 + 9}, $${i * 10 + 10})`).join(', ');
        const comboValues = comboSetValue.flat();
        const transitionComboSetQuery = `
            INSERT INTO transaction_combo_set(id, combo_set_name, quantity, total_amount, price, is_take_away, transaction_id, container_charges, discount_price, combo_set_id)
            VALUES ${comboValuePlaceholders}
            RETURNING *;
        `;
        const { rows: comboSetItems} = await poolQuery(transitionComboSetQuery, comboValues);
        result.push(...comboSetItems);
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
    const { rows: normalMenuItem } = await poolQuery(query, flattenedValues);
    result.push(...normalMenuItem);

    if (result.length > 0) {
        return result;
    } else {
        throw new Error("No data returned after insert.");
    }
}

const getDashboardTotalAmount = async (dieInTakeAwayQuery, deliveryAndTotalRevQuery) => {
    const showDashboardData = { "dieInAmount": 0, "takeawayAmount": 0, "deliveryAmount": 0, "totalRevenueAmount": 0 }

    // CURRENT_DATE
    const { rows: transactionItemsData } = await poolQuery(dieInTakeAwayQuery);
    console.log(`transitionItemModal [getTransactionItemByDate] transactionItemsData : `, transactionItemsData);
    transactionItemsData.forEach(each => {
        switch (each.type){
            case "dine_in":
                showDashboardData.dieInAmount = Number(each.grand_total_amount);
                break;
            case "takeaway":
                showDashboardData.takeawayAmount = Number(each.grand_total_amount);
                break;
        }
    })

    const { rows: transitionData } = await poolQuery(deliveryAndTotalRevQuery);
    console.log(`transitionItemModal [getTransactionItemByDate] transitionData : `, transitionData);

    transitionData.forEach(each => {
        switch (each.type){
            case "delivery":
                showDashboardData.deliveryAmount = Number(each.total_revenue);
                showDashboardData.totalRevenueAmount += Number(each.total_revenue);
                break;
            case "self":
                showDashboardData.totalRevenueAmount += Number(each.total_revenue);
                break;
        }
    })

    return showDashboardData;
}

const getBestSellerItems = async (besetSellerItemQuery) => {
    const { rows: bestItemsData } = await poolQuery(besetSellerItemQuery)

    console.log(`transitionItemModal [getBestSellerItems] bestItemsData: `, bestItemsData);
    return bestItemsData;
}

module.exports = { findTransactionItemsByTransactionId, addTransitionItems, getDashboardTotalAmount, getBestSellerItems };