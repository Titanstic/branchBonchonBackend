const poolQuery = require("../../misc/poolQuery");

const findStockItemById = async (stockId) => {
    const { rows: stockItemData } = await poolQuery(`
        SELECT
            sitem.purchase_qty as s_purchase_qty,
            sitem.inventory_qty as s_inventory_qty,
            sitem.recipe_qty as s_recipe_qty,
            uom.purchase_qty,
            uom.purchase_unit,
            uom.inventory_qty,
            uom.inventory_unit,
            uom.recipe_qty,
            uom.recipe_unit
        FROM stock_items AS sitem
        LEFT JOIN unit_of_measurement AS uom
            ON sitem.unit_id = uom.id
        WHERE sitem.id = $1;
    `, [stockId]);

    if(stockItemData.length === 0){
        throw new Error(`stockItem id ${stockId} not found`);
    }

    console.log(`purchaseOrderModel [findStockItemById] stockItemData: `, stockItemData[0]);
    return stockItemData[0];
}

const updateStockQtyById = async (purchaseQty, inventoryQty, recipeQty, stockItemId) => {
    const { rowCount } = await poolQuery(`
            UPDATE stock_items
            SET purchase_qty = $1, inventory_qty = $2, recipe_qty = $3
            WHERE id = $4
        `,
        [purchaseQty, inventoryQty, recipeQty, stockItemId]
    );

    if(rowCount === 0) {
        throw new Error(`Update error in stock item id - ${stockItemId}`)
    }

    console.log(`purchaseOrderModel [updateStockQtyById] updateStockQty: successfully`);
};

module.exports = { findStockItemById, updateStockQtyById };