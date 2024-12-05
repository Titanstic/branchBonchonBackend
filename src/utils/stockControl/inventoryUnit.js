const reduceInventoryUnit = (stockItemData, inventoryQty) => {
    let reduceRecipeQty = 0;

    if(stockItemData.recipe_unit){
        reduceRecipeQty = stockItemData.inventory_unit !== stockItemData.recipe_unit ?
            inventoryQty * stockItemData.s_recipe_qty
            :
            inventoryQty
        ;
        console.log(`[reduceInventoryUnit] reduceRecipeQty: `, reduceRecipeQty);
    }

    const currentQty = stockItemData.current_qty - (stockItemData.recipe_unit ? reduceRecipeQty : inventoryQty);
    console.log(`[reduceInventoryUnit] current_qty: `, currentQty );

    return currentQty;

    // stockItemData.s_inventory_qty -= quantity;
    // console.log(`reduceInventoryUnit currentInventoryQty: `, stockItemData.s_inventory_qty);
    //
    // stockItemData.s_purchase_qty = stockItemData.purchase_unit !== stockItemData.inventory_unit ?
    //     Math.ceil(stockItemData.s_inventory_qty / stockItemData.inventory_qty)
    //     :
    //     stockItemData.s_purchase_qty - quantity
    // ;
    // console.log(`reduceInventoryUnit currentPurchaseQty: `, stockItemData.s_purchase_qty);
    //
    // if(stockItemData.s_recipe_qty){
    //     stockItemData.s_recipe_qty -= stockItemData.inventory_unit !== stockItemData.recipe_unit ?
    //         quantity * stockItemData.recipe_qty
    //         :
    //         quantity
    //     ;
    //     console.log(`reduceInventoryUnit currentRecipeQty: `, stockItemData.s_recipe_qty);
    // }
    //
    // return {
    //     currentPurchaseQty: stockItemData.s_purchase_qty,
    //     currentInventoryQty: stockItemData.s_inventory_qty,
    //     currentRecipeQty: stockItemData.s_recipe_qty
    // }
};

const addInventoryUnit = (stockItemData, inventoryQty) => {
    let addRecipeQty = 0;

    if(stockItemData.recipe_unit){
        addRecipeQty = stockItemData.inventory_unit !== stockItemData.recipe_unit ?
            inventoryQty * stockItemData.s_recipe_qty
            :
            inventoryQty
        ;
        console.log(`[addInventoryUnit] addRecipeQty: `, addRecipeQty);
    }

    const currentQty = stockItemData.current_qty + (stockItemData.recipe_unit ? addRecipeQty : inventoryQty);
    console.log(`[addInventoryUnit] current_qty: `, currentQty );

    return currentQty;

    // stockItemData.s_inventory_qty += quantity;
    // console.log(`addInventoryUnit currentInventoryQty: `, stockItemData.s_inventory_qty);
    //
    // stockItemData.s_purchase_qty = stockItemData.purchase_unit !== stockItemData.inventory_unit ?
    //     Math.ceil(stockItemData.s_inventory_qty / stockItemData.inventory_qty)
    //     :
    //     stockItemData.s_purchase_qty + quantity
    // ;
    // console.log(`addInventoryUnit currentPurchaseQty: `, stockItemData.s_purchase_qty);
    //
    // if(stockItemData.s_recipe_qty){
    //     stockItemData.s_recipe_qty += stockItemData.inventory_unit !== stockItemData.recipe_unit ?
    //         quantity * stockItemData.recipe_qty
    //         :
    //         quantity
    //     ;
    //     console.log(`addInventoryUnit currentRecipeQty: `, stockItemData.s_recipe_qty);
    // }
    //
    // return {
    //     currentPurchaseQty: stockItemData.s_purchase_qty,
    //     currentInventoryQty: stockItemData.s_inventory_qty,
    //     currentRecipeQty: stockItemData.s_recipe_qty
    // }
};

module.exports = { reduceInventoryUnit, addInventoryUnit };