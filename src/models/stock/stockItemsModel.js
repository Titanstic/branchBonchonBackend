const poolQuery = require("../../../misc/poolQuery");

const getStockItemAndRecipeByMenuId = async (menuId, menuQty, voidSlip, isTakeAway) => {
    let query;
    if(isTakeAway){
        query = `
            SELECT
                si.id AS stock_id,
                si.name AS stock_name,
                CASE
                    WHEN ${voidSlip} = true
                        THEN si.current_qty + (SUM(ri.qty) * ${menuQty})
                    ELSE si.current_qty - (SUM(ri.qty) * ${menuQty})
                END AS update_current_qty,
                CASE
                    WHEN si.recipe_qty IS NOT NULL
                        THEN CAST(si.current_qty AS DECIMAL) / CAST(si.recipe_qty AS DECIMAL)
                    ELSE CAST(si.current_qty AS DECIMAL)
                END AS opening_sale,
                CASE
                    WHEN si.recipe_qty IS NOT NULL
                        THEN CAST((SUM(ri.qty) * ${menuQty}) AS DECIMAL) / CAST(si.recipe_qty AS DECIMAL)
                    ELSE CAST((SUM(ri.qty) * ${menuQty}) AS DECIMAL)
                END AS used_inventory_qty
            FROM stock_items AS si
            LEFT JOIN recipe_items AS ri
                ON si.id = ri.stock_items_id
            LEFT JOIN recipes AS r
                ON ri.recipe_id = r.id
            LEFT JOIN menu_recipe_items AS mri
                ON r.id = mri.recipe_id
            WHERE mri.menu_id = $1
            GROUP BY si.id
        `;
    }else{
        query = `
            SELECT
                si.id AS stock_id,
                si.name AS stock_name,
                CASE
                    WHEN ${voidSlip} = true
                        THEN si.current_qty + (SUM(ri.qty) * ${menuQty})
                    ELSE si.current_qty - (SUM(ri.qty) * ${menuQty})
                END AS update_current_qty,
                CASE
                    WHEN si.recipe_qty IS NOT NULL
                        THEN CAST(si.current_qty AS DECIMAL) / CAST(si.recipe_qty AS DECIMAL)
                    ELSE CAST(si.current_qty AS DECIMAL)
                END AS opening_sale,
                CASE
                    WHEN si.recipe_qty IS NOT NULL
                        THEN CAST((SUM(ri.qty) * ${menuQty}) AS DECIMAL) / CAST(si.recipe_qty AS DECIMAL)
                    ELSE CAST((SUM(ri.qty) * ${menuQty}) AS DECIMAL)
                END AS used_inventory_qty
            FROM stock_items AS si
            LEFT JOIN recipe_items AS ri
                ON si.id = ri.stock_items_id
            LEFT JOIN recipes AS r
                ON ri.recipe_id = r.id
            LEFT JOIN menu_recipe_items AS mri
                ON r.id = mri.recipe_id
            WHERE mri.menu_id = $1 AND ri.type = 'dine_in'
            GROUP BY si.id
        `;
    }

    const { rows: stockItemData } = await poolQuery(query, [menuId]);

    if(stockItemData.length === 0){
        throw new Error("No getStockItemAndRecipeByMenuId data found.");
    }

    return stockItemData;
}

const getAllStockItem = async () => {
    const { rows: stockItemData } = await poolQuery(`
        SELECT
            sitem.id,
            sitem.name,
            sitem.recipe_qty as s_recipe_qty,
            sitem.current_qty,
            CASE
                WHEN sitem.recipe_qty IS NOT NULL
                    THEN CAST(sitem.current_qty AS DECIMAL) / CAST(sitem.recipe_qty AS DECIMAL)
                ELSE CAST(sitem.current_qty AS DECIMAL)
            END AS inventory_sale
        FROM stock_items AS sitem
        LEFT JOIN recipe_units AS rc
            ON sitem.recipe_unit_id = rc.id
    `);

    if(stockItemData.length === 0){
        throw new Error(`stockItem doesn't found`);
    }

    // console.log(`stockItemsModel [getAllStockItem] stockItemData: `, stockItemData);
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

    console.log(`stockItemsModel [findStockItemById] stockItemData: `, stockItemData[0]);
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

module.exports = { getStockItemAndRecipeByMenuId, getAllStockItem, findStockItemById, updateStockQtyById };