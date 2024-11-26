const reduceInventoryUnit = (stockItemData, quantity) => {
    stockItemData.s_inventory_qty -= quantity;
    console.log(`reduceInventoryUnit currentInventoryQty: `, stockItemData.s_inventory_qty);

    stockItemData.s_purchase_qty = stockItemData.purchase_unit !== stockItemData.inventory_unit ?
        Math.ceil(stockItemData.s_inventory_qty / stockItemData.inventory_qty)
        :
        stockItemData.s_purchase_qty - quantity
    ;
    console.log(`reduceInventoryUnit currentPurchaseQty: `, stockItemData.s_purchase_qty);

    if(stockItemData.s_recipe_qty){
        stockItemData.s_recipe_qty -= stockItemData.inventory_unit !== stockItemData.recipe_unit ?
            quantity * stockItemData.recipe_qty
            :
            quantity
        ;
        console.log(`reduceInventoryUnit currentRecipeQty: `, stockItemData.s_recipe_qty);
    }

    return {
        currentPurchaseQty: stockItemData.s_purchase_qty,
        currentInventoryQty: stockItemData.s_inventory_qty,
        currentRecipeQty: stockItemData.s_recipe_qty
    }
};

const addInventoryUnit = (stockItemData, quantity) => {
    stockItemData.s_inventory_qty += quantity;
    console.log(`addInventoryUnit currentInventoryQty: `, stockItemData.s_inventory_qty);

    stockItemData.s_purchase_qty = stockItemData.purchase_unit !== stockItemData.inventory_unit ?
        Math.ceil(stockItemData.s_inventory_qty / stockItemData.inventory_qty)
        :
        stockItemData.s_purchase_qty + quantity
    ;
    console.log(`addInventoryUnit currentPurchaseQty: `, stockItemData.s_purchase_qty);

    if(stockItemData.s_recipe_qty){
        stockItemData.s_recipe_qty += stockItemData.inventory_unit !== stockItemData.recipe_unit ?
            quantity * stockItemData.recipe_qty
            :
            quantity
        ;
        console.log(`addInventoryUnit currentRecipeQty: `, stockItemData.s_recipe_qty);
    }

    return {
        currentPurchaseQty: stockItemData.s_purchase_qty,
        currentInventoryQty: stockItemData.s_inventory_qty,
        currentRecipeQty: stockItemData.s_recipe_qty
    }
};

module.exports = { reduceInventoryUnit, addInventoryUnit };