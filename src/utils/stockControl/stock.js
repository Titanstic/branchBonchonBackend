const {getStockItemAndRecipeByMenuId, updateStockQtyById} = require("../../models/stock/stockItemsModel");
const {reduceRecipeUnit, addRecipeUnit} = require("./recipeUnit");
const {filterInventoryReport} = require("./inventory");

const calculateStock = async (transactionItem, voidSlip) => {
    if (transactionItem.length > 0) {
        for (const each of transactionItem) {
            let updateStockItemData;

            const stockItemData = await getStockItemAndRecipeByMenuId(each.normal_menu_item_id, each.quantity, voidSlip);
            console.log(`utils stock [calculateStock] stockItemData:`, stockItemData);

            console.log(each.is_take_away);
            if(each.is_take_away){
                updateStockItemData = stockItemData;
            }else{
                updateStockItemData = stockItemData.filter(item => item.takeaway !== true);
            }
            console.log(`updateStockItemData:`, updateStockItemData);

            console.log(`---------------------------------------------`);

            for (const item of updateStockItemData) {
                await updateStockQtyById(item.update_current_qty, item.stock_id);

                const inventoryQty = voidSlip ? Number(item.used_inventory_qty) : -item.used_inventory_qty;
                await filterInventoryReport(item.stock_id, "sales", item.opening_sale, inventoryQty);
            }
        }
    }
};

module.exports = { calculateStock };