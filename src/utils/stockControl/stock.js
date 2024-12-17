const {getStockItemAndRecipeByMenuId, updateStockQtyById} = require("../../models/stock/stockItemsModel");
const {reduceRecipeUnit, addRecipeUnit} = require("./recipeUnit");
const {filterInventoryReport} = require("./inventory");

const calculateStock = async (transactionItem, voidSlip) => {
    if (transactionItem.length > 0) {
        for (const each of transactionItem) {
            const stockItemData = await getStockItemAndRecipeByMenuId(each.normal_menu_item_id, each.quantity, voidSlip, each.is_take_away);
            console.log(`utils stock [calculateStock] stockItemData:`, stockItemData);

            for (const item of stockItemData) {
                await updateStockQtyById(item.update_current_qty, item.stock_id);

                const inventoryQty = voidSlip ? Number(item.used_inventory_qty) : -item.used_inventory_qty;
                await filterInventoryReport(item.stock_id, "sales", item.opening_sale, inventoryQty);
            }
        }
    }
};

module.exports = { calculateStock };