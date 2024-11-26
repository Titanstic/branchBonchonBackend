const addPurchaseUnit = (stockItemData, inputData) => {
    stockItemData.s_purchase_qty += inputData.qty;
    console.log(`[addPurchaseUnit] currentPurchaseQty: `, stockItemData.s_purchase_qty);

    stockItemData.s_inventory_qty += stockItemData.purchase_unit !== stockItemData.inventory_unit ?
        inputData.qty * stockItemData.inventory_qty
        :
        inputData.qty
    ;
    console.log(`[addPurchaseUnit] currentInventoryQty: `, stockItemData.s_inventory_qty);

    if(stockItemData.s_recipe_qty){
        const getInventoryQty = inputData.qty * stockItemData.inventory_qty;
        stockItemData.s_recipe_qty += stockItemData.inventory_unit !== stockItemData.recipe_unit ?
            getInventoryQty * stockItemData.recipe_qty
            :
            getInventoryQty
        ;
        console.log(`[addPurchaseUnit] currentRecipeQty: `, stockItemData.s_recipe_qty);
    }

    return {
        currentPurchaseQty: stockItemData.s_purchase_qty,
        currentInventoryQty: stockItemData.s_inventory_qty,
        currentRecipeQty: stockItemData.s_recipe_qty
    }
};

const reducePurchaseUnit = (stockItemData, inputData) => {
    stockItemData.s_purchase_qty -= inputData.qty;
    console.log(`[reducePurchaseUnit] currentPurchaseQty: `, stockItemData.s_purchase_qty);

    stockItemData.s_inventory_qty -= stockItemData.purchase_unit !== stockItemData.inventory_unit ?
        inputData.qty * stockItemData.inventory_qty
        :
        inputData.qty
    ;
    console.log(`[reducePurchaseUnit] currentInventoryQty: `, stockItemData.s_inventory_qty);

    if(stockItemData.s_recipe_qty){
        const getInventoryQty = inputData.qty * stockItemData.inventory_qty;
        stockItemData.s_recipe_qty -= stockItemData.inventory_unit !== stockItemData.recipe_unit ?
            getInventoryQty * stockItemData.recipe_qty
            :
            getInventoryQty
        ;
        console.log(`[reducePurchaseUnit] currentRecipeQty: `, stockItemData.s_recipe_qty);
    }

    return {
        currentPurchaseQty: stockItemData.s_purchase_qty,
        currentInventoryQty: stockItemData.s_inventory_qty,
        currentRecipeQty: stockItemData.s_recipe_qty
    }
};

module.exports = { addPurchaseUnit, reducePurchaseUnit };

