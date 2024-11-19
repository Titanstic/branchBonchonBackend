const poolQuery = require("../../misc/poolQuery");

const findStockItemById = async (stockId) => {
    const { rows: stockItemData } = await poolQuery(`
        SELECT 
            inventory_qty 
        FROM stock_items
        WHERE id = $1;
    `, [stockId]);

    if(stockItemData.length === 0){
        throw new Error(`stockItem id ${stockId} not found`);
    }

    return stockItemData[0];
}

const addStockItemForGoodReceived = async (stockId, qty) => {
    const { rowCount } = await poolQuery(`
        UPDATE stock_items 
        SET inventory_qty = $1
        WHERE id = $2
    `, [qty, stockId]);

    if(rowCount === 0){
        throw new Error(`Update inventory qty error`);
    }

    console.log(rowCount);
};

module.exports = { findStockItemById, addStockItemForGoodReceived };