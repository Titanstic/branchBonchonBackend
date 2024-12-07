const {getStockItemAndRecipeByMenuId, updateStockQtyById} = require("../../models/stock/stockItemsModel");
const {reduceRecipeUnit, addRecipeUnit} = require("./recipeUnit");

const calculateStock = async (transactionItem, voidSlip) => {
    if (transactionItem.length > 0) {
        for (const each of transactionItem) {
            const isTakeAway = each.is_take_away ? "takeaway" : "dine_in";
            const stockItemData = await getStockItemAndRecipeByMenuId(each.normal_menu_item_id, isTakeAway);
            console.log(`utils stock [calculateStock] stockItemData:`, stockItemData);

            for (const item of stockItemData) {
                const currentQty = voidSlip ? addRecipeUnit(item) : reduceRecipeUnit(item);

                await updateStockQtyById(currentQty, item.stock_id);
            }
        }
    }
};

module.exports = { calculateStock };