const poolQuery = require("../../../misc/poolQuery");

const findInventoryReportItemByDate = async (stockId) => {
    const { rows: inventoryReport } = await poolQuery(`
        SELECT * FROM inventory_reports
        WHERE DATE(created_at) = CURRENT_DATE AND stock_id = $1;
    `, [stockId]);

    return inventoryReport;
};

const insertInventoryReportItem = async (columnName, stockId, initialSale, value, closingAmount) => {
    const { rowCount } = await poolQuery(`
        INSERT INTO inventory_reports(stock_id, opening_sale, ${columnName}, closing)
        VALUES ($1, $2, $3, $4);
    `, [stockId, initialSale, value, closingAmount]);

    if(rowCount === 0) throw new Error(`Error :Insert Inventory Report in insertInventoryReportItem `);

    console.log("Insert Inventory Report Successfully");
};

const updateInventoryReportItem = async (columnName, value, closingAmount, inventoryReportId) => {
    const { rowCount } = await poolQuery(`
        UPDATE inventory_reports
        SET ${columnName} = $1, closing = $2
        WHERE id = $3;
    `, [value, closingAmount, inventoryReportId]);

    if(rowCount === 0) throw new Error(`Error :Update Inventory Report in insertInventoryReportItem `);

    console.log("Update Inventory Report Successfully");
}

module.exports = { findInventoryReportItemByDate, insertInventoryReportItem, updateInventoryReportItem };