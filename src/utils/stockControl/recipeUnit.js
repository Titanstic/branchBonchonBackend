const reduceRecipeUnit = (stockItemData) => {
    return stockItemData.current_qty - stockItemData.used_recipe_qty;

    // if(stockItemData.uom_recipe_unit){
    //     stockItemData.s_recipe_qty -= stockItemData.used_recipe_qty;
    //     console.log(`stock [reduceStockTransaction] currentRecipeQty: `, stockItemData.s_recipe_qty);
    //
    //     stockItemData.s_inventory_qty = stockItemData.uom_inventory_unit !== stockItemData.uom_recipe_unit ?
    //         Math.ceil(stockItemData.s_recipe_qty / stockItemData.uom_recipe_qty)
    //         :
    //         stockItemData.s_inventory_qty - stockItemData.s_recipe_qty
    //     ;
    //     console.log(`stock [reduceStockTransaction] currentInventoryQty: ${stockItemData.s_recipe_qty} / ${stockItemData.uom_recipe_qty} =`, stockItemData.s_inventory_qty);
    // }else{
    //     stockItemData.s_inventory_qty -= stockItemData.used_recipe_qty;
    //     console.log(`stock [reduceStockTransaction] currentInventoryQty: `, stockItemData.s_inventory_qty);
    // }
    //
    // stockItemData.s_purchase_qty = stockItemData.uom_inventory_unit !== stockItemData.uom_purchase_unit ?
    //         Math.ceil(stockItemData.s_inventory_qty / stockItemData.uom_inventory_qty)
    //         :
    //     stockItemData.s_purchase_qty - stockItemData.s_inventory_qty
    // ;
    // console.log(`stock [reduceStockTransaction] currentPurchaseQty: ${stockItemData.s_inventory_qty} / ${stockItemData.uom_inventory_qty} =`, stockItemData.s_purchase_qty);
    //
    // return {
    //     currentPurchaseQty: stockItemData.s_purchase_qty,
    //     currentInventoryQty: stockItemData.s_inventory_qty,
    //     currentRecipeQty: stockItemData.s_recipe_qty
    // }
};

const addRecipeUnit = (stockItemData) => {
    return stockItemData.current_qty + stockItemData.used_recipe_qty;

    // if(stockItemData.uom_recipe_unit){
    //     stockItemData.s_recipe_qty += stockItemData.used_recipe_qty;
    //     console.log(`stock [addRecipeUnit] currentRecipeUnit: `, stockItemData.s_recipe_qty);
    //
    //     stockItemData.s_inventory_qty = stockItemData.uom_inventory_unit !== stockItemData.uom_recipe_unit ?
    //         Math.ceil(stockItemData.s_recipe_qty / stockItemData.uom_recipe_qty)
    //         :
    //         stockItemData.s_inventory_qty + stockItemData.s_recipe_qty
    //     ;
    //     console.log(`stock [addRecipeUnit] currentInventoryQty: `, stockItemData.s_inventory_qty);
    // }else{
    //     stockItemData.s_inventory_qty += stockItemData.used_recipe_qty;
    //     console.log(`stock [addRecipeUnit] currentInventoryQty: `, stockItemData.s_inventory_qty);
    // }
    //
    // stockItemData.s_purchase_qty = stockItemData.uom_inventory_unit !== stockItemData.uom_purchase_unit ?
    //     Math.ceil(stockItemData.s_inventory_qty / stockItemData.uom_inventory_qty)
    //     :
    //     stockItemData.s_purchase_qty + stockItemData.s_inventory_qty
    // ;
    // console.log(`stock [addRecipeUnit] currentPurchaseQty: `, stockItemData.s_purchase_qty);
    //
    // return {
    //     currentPurchaseQty: stockItemData.s_purchase_qty,
    //     currentInventoryQty: stockItemData.s_inventory_qty,
    //     currentRecipeQty: stockItemData.s_recipe_qty
    // }
};

module.exports = { reduceRecipeUnit, addRecipeUnit };