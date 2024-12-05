const poolQuery = require("../../../misc/poolQuery");

const insertInventoryTransaction = async (stockId, oldQty, newQty, tableName, tableId, inputQty) => {
    const { rowCount }  = await poolQuery(`
        INSERT INTO inventory_transactions(stock_id, old_qty, new_qty, table_name, table_id, input_qty)
        VALUES($1, $2, $3, $4, $5, $6)
    `, [stockId, oldQty, newQty, tableName, tableId, inputQty]);

    if(rowCount === 0){
        throw new Error(`Insert Inventory Transaction error for ${tableName} ${tableId}`);
    }

    console.log("[insertInventoryTransaction] Insert Inventory Transaction successfully");
};

module.exports = { insertInventoryTransaction };