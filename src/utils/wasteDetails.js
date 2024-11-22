const calculateWasteItem = (stockItemData, quantity) => {
    stockItemData.s_inventory_qty -= quantity;
    console.log(`goodReceivedItemController currentInventoryQty: `, stockItemData.s_inventory_qty);

    if(stockItemData.purchase_unit !== stockItemData.inventory_unit){
        stockItemData.s_purchase_qty = Math.ceil(stockItemData.s_inventory_qty / stockItemData.inventory_qty);
    }else{
        stockItemData.s_purchase_qty -= quantity;
    }
    console.log(`goodReceivedItemController currentPurchaseQty: `, stockItemData.s_purchase_qty);

    if(stockItemData.s_recipe_qty){
        if(stockItemData.inventory_unit !== stockItemData.recipe_unit ){
            stockItemData.s_recipe_qty -= quantity * stockItemData.recipe_qty;
        }else{
            stockItemData.s_recipe_qty -= quantity;
        }
        console.log(`goodReceivedItemController currentRecipeQty: `, stockItemData.s_recipe_qty);
    }

    const currentPurchaseQty = stockItemData.s_purchase_qty;
    const currentInventoryQty = stockItemData.s_inventory_qty;
    const currentRecipeQty = stockItemData.s_recipe_qty;
    return { currentPurchaseQty, currentInventoryQty, currentRecipeQty }
};

module.exports = { calculateWasteItem };