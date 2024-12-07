const poolQuery = require("../../../misc/poolQuery");

const getStockItemAndRecipeByMenuId = async (menuId, takeAway) => {
    const { rows: stockItemData } = await poolQuery(`
        SELECT 
            stock_items.id AS stock_id,
            stock_items.name AS stock_name,
            stock_items.purchase_qty AS s_purchase_qty,
            stock_items.inventory_qty AS s_inventory_qty,
            stock_items.recipe_qty AS s_recipe_qty,
            stock_items.current_qty,
            uom.purchase_unit AS uom_purchase_unit,
            uom.inventory_unit AS uom_inventory_unit,
            uom.recipe_unit AS uom_recipe_unit,
            recipe_items.qty AS used_recipe_qty,
            CASE 
                WHEN recipe_items.type = 'dine_in' THEN false
                ELSE true
            END AS takeaway,
            recipes.sale_type
        FROM stock_items
        LEFT JOIN unit_of_measurement AS uom
            ON stock_items.unit_id = uom.id
        LEFT JOIN recipe_items
            ON stock_items.id = recipe_items.stock_items_id
        LEFT JOIN recipes
            ON recipe_items.recipe_id = recipes.id
        LEFT JOIN menu_recipe_items
            ON recipes.id = menu_recipe_items.recipe_id
        LEFT JOIN normal_menu_items
            ON menu_recipe_items.menu_id = normal_menu_items.id
        WHERE normal_menu_items.id = $1 AND recipe_items.type = $2;
    `, [menuId, takeAway]);

    if(stockItemData.length === 0){
        throw new Error("No getStockItemAndRecipeByMenuId data found.");
    }

    return stockItemData;
}


const findStockItemById = async (stockId) => {
    const { rows: stockItemData } = await poolQuery(`
        SELECT
            sitem.purchase_qty as s_purchase_qty,
            sitem.inventory_qty as s_inventory_qty,
            sitem.recipe_qty as s_recipe_qty,
            sitem.current_qty,
            pu.purchase_name AS purchase_unit,
            iu.inventory_name AS inventory_unit,
            rc.recipe_name AS recipe_unit
        FROM stock_items AS sitem
        LEFT JOIN purchase_units AS pu
            ON sitem.purchase_unit_id = pu.id
        LEFT JOIN inventory_units AS iu
            ON sitem.inventory_unit_id = iu.id
        LEFT JOIN recipe_units AS rc
            ON sitem.recipe_unit_id = rc.id
        WHERE sitem.id = $1;
    `, [stockId]);

    if(stockItemData.length === 0){
        throw new Error(`stockItem id ${stockId} not found`);
    }

    console.log(`purchaseOrderModel [findStockItemById] stockItemData: `, stockItemData[0]);
    return stockItemData[0];
}

const updateStockQtyById = async (currentQty, stockItemId) => {
    const { rowCount } = await poolQuery(`
            UPDATE stock_items
            SET current_qty = $1
            WHERE id = $2
        `,
        [currentQty, stockItemId]
    );

    if(rowCount === 0) {
        throw new Error(`Update error in stock item id - ${stockItemId}`)
    }

    console.log(`purchaseOrderModel [updateStockQtyById] updateStockQty: successfully`);
};

module.exports = { getStockItemAndRecipeByMenuId, findStockItemById, updateStockQtyById };