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

    return currentQty;

    // Delete later
    // stockItemData.s_purchase_qty += inputData.qty;
    // console.log(`[addPurchaseUnit] currentPurchaseQty: `, stockItemData.s_purchase_qty);
    //
    // stockItemData.s_inventory_qty += stockItemData.purchase_unit !== stockItemData.inventory_unit ?
    //     inputData.qty * stockItemData.inventory_qty
    //     :
    //     inputData.qty
    // ;
    // console.log(`[addPurchaseUnit] currentInventoryQty: `, stockItemData.s_inventory_qty);

    // if(stockItemData.s_recipe_qty){
    //     const getInventoryQty = inputData.qty * stockItemData.inventory_qty;
    //     stockItemData.s_recipe_qty += stockItemData.inventory_unit !== stockItemData.recipe_unit ?
    //         getInventoryQty * stockItemData.recipe_qty
    //         :
    //         getInventoryQty
    //     ;
    //     console.log(`[addPurchaseUnit] currentRecipeQty: `, stockItemData.s_recipe_qty);
    // }
    //
    // return {
    //     currentPurchaseQty: stockItemData.s_purchase_qty,
    //     currentInventoryQty: stockItemData.s_inventory_qty,
    //     currentRecipeQty: stockItemData.s_recipe_qty
    // }
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

    return currentQty;

    // stockItemData.s_purchase_qty -= inputData.qty;
    // console.log(`[reducePurchaseUnit] currentPurchaseQty: `, stockItemData.s_purchase_qty);
    //
    // stockItemData.s_inventory_qty -= stockItemData.purchase_unit !== stockItemData.inventory_unit ?
    //     inputData.qty * stockItemData.inventory_qty
    //     :
    //     inputData.qty
    // ;
    // console.log(`[reducePurchaseUnit] currentInventoryQty: `, stockItemData.s_inventory_qty);
    //
    // if(stockItemData.s_recipe_qty){
    //     const getInventoryQty = inputData.qty * stockItemData.inventory_qty;
    //     stockItemData.s_recipe_qty -= stockItemData.inventory_unit !== stockItemData.recipe_unit ?
    //         getInventoryQty * stockItemData.recipe_qty
    //         :
    //         getInventoryQty
    //     ;
    //     console.log(`[reducePurchaseUnit] currentRecipeQty: `, stockItemData.s_recipe_qty);
    // }
    //
    // return {
    //     currentPurchaseQty: stockItemData.s_purchase_qty,
    //     currentInventoryQty: stockItemData.s_inventory_qty,
    //     currentRecipeQty: stockItemData.s_recipe_qty
    // }
};

module.exports = { addPurchaseUnit, reducePurchaseUnit };

