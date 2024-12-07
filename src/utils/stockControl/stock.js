const {getStockItemAndRecipeByMenuId, updateStockQtyById} = require("../../models/stock/stockItemsModel");
const {reduceRecipeUnit, addRecipeUnit} = require("./recipeUnit");
const {filterInventoryReport} = require("./inventory");

const calculateStock = async (transactionItem, voidSlip) => {
    if (transactionItem.length > 0) {
        for (const each of transactionItem) {
            const isTakeAway = each.is_take_away ? "takeaway" : "dine_in";
            const stockItemData = await getStockItemAndRecipeByMenuId(each.normal_menu_item_id, isTakeAway, each.quantity);
            console.log(`utils stock [calculateStock] stockItemData:`, stockItemData);

            for (const item of stockItemData) {
                const currentQty = voidSlip ? addRecipeUnit(item) : reduceRecipeUnit(item);

                await updateStockQtyById(currentQty, item.stock_id);

            //    add or update inventory report
                const openingSale = (item.uom_recipe_unit ? item.current_qty / item.s_recipe_qty : item.current_qty).toFixed(2);
                const usedInventoryQty = (item.uom_recipe_unit ? item.used_recipe_qty / item.s_recipe_qty : item.used_recipe_qty).toFixed(2);
                const inventoryQty = voidSlip ? usedInventoryQty : -usedInventoryQty;

                await filterInventoryReport(item.stock_id, "sales", openingSale, inventoryQty);
            }
        }
    }
};

module.exports = { calculateStock };