const {fetchWithTimeOut} = require("../../misc/fetchApi");
const {v4: uuidv4} = require("uuid");
const {addTransitionItems} = require("../models/transaction/transactionItemModel");
const {updateTransition} = require("../models/transaction/transactionModel");

const fetchOnlineDbTransition = async (data, id) => {
    await fetchWithTimeOut("onlineTransition", {method: "POST", body: JSON.stringify(data)})
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
};

const transitionItems = async (transition_id, items) => {
    const parsedItems = typeof items == "string" ? JSON.parse(items) : items;
    const kitchenPrintItem = [];
    const itemValue = [];
    const comboSetValue = [];

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

            // for multiple insert value for transition items table
            itemValue.push([item.item_name, item.quantity, item.total_amount, item.price, item.is_take_away, item.note ? item.note : "", transition_id, item.normal_menu_item_id, item.container_charges, item.discount_price, item.flavour_types, null]);
        }else{
            const transitionComboSetId = uuidv4();
            // for multiple insert value for transition combo set table
            comboSetValue.push([transitionComboSetId, item.item_name, item.quantity, item.total_amount, item.price, item.is_take_away, transition_id, item.container_charges, item.discount_price, item.combo_set_id]);

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

                // for multiple insert value for transition items table
                itemValue.push([eachCombo.item_name, eachCombo.quantity, 0, 0, eachCombo.is_take_away, eachCombo.note ? eachCombo.note : "", null, eachCombo.normal_menu_item_id, 0, 0, eachCombo.flavour_types, transitionComboSetId]);
            })
        }

    }

    const itemResults = await addTransitionItems(itemValue, comboSetValue);
    return { parsedItems, kitchenPrintItem, itemResults };
}

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
};



module.exports = { fetchOnlineDbTransition, transitionItems, filterKitchenItem };