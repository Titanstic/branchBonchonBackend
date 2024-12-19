const addPurchaseUnit = (stockItemData, purchaseQty) => {
    let addRecipeQty = 0;

    const addInventoryQty = stockItemData.purchase_unit !== stockItemData.inventory_unit ?
        stockItemData.s_inventory_qty * purchaseQty
        :
        purchaseQty
    ;
    console.log(`[addPurchaseUnit] addInventoryQty: `, addInventoryQty);

    if(stockItemData.recipe_unit){
        addRecipeQty = stockItemData.inventory_unit !== stockItemData.recipe_unit ?
            addInventoryQty * stockItemData.s_recipe_qty
            :
            addInventoryQty
        ;
        console.log(`[addPurchaseUnit] addRecipeQty: `, addRecipeQty);
    }

    const currentQty = stockItemData.current_qty + (stockItemData.recipe_unit ? addRecipeQty : addInventoryQty);
    console.log(`[addPurchaseUnit] current_qty: `, currentQty);

    return {addInventoryQty, currentQty};
};

const reducePurchaseUnit = (stockItemData, purchaseQty) => {
    let reduceRecipeQty = 0;

    const reduceInventoryQty = stockItemData.purchase_unit !== stockItemData.inventory_unit ?
        stockItemData.s_inventory_qty * purchaseQty
        :
        purchaseQty
    ;
    console.log(`[reducePurchaseUnit] reduceInventoryQty: `, reduceInventoryQty);

    if(stockItemData.recipe_unit){
        reduceRecipeQty = stockItemData.inventory_unit !== stockItemData.recipe_unit ?
            reduceInventoryQty * stockItemData.s_recipe_qty
            :
            reduceInventoryQty
        ;
        console.log(`[reducePurchaseUnit] reduceRecipeQty: `, reduceRecipeQty);
    }

    const currentQty = stockItemData.current_qty - (stockItemData.recipe_unit ? reduceRecipeQty : reduceInventoryQty);
    console.log(`[reducePurchaseUnit] current_qty: `, currentQty);

    return { reduceInventoryQty, currentQty };
};

module.exports = { addPurchaseUnit, reducePurchaseUnit };

