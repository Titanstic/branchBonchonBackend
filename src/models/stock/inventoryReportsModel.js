const poolQuery = require("../../../misc/poolQuery");

const findInventoryReportItemByDateAndStockId = async (stockId) => {
    const { rows: inventoryReport } = await poolQuery(`
        SELECT * FROM inventory_reports
        WHERE DATE(created_at) = CURRENT_DATE AND stock_id = $1;
    `, [stockId]);

    console.log(`InventoryReportsModel [findInventoryReportItemByDateAndStockId] inventoryReport:`, inventoryReport);

    return inventoryReport;
};

const findInventoryReportItemByCurrentDate = async () => {
    const { rows: inventoryReport } = await poolQuery(`
        SELECT stock_id FROM inventory_reports
        WHERE DATE(created_at) = CURRENT_DATE;
    `);

    // console.log(`InventoryReportsModel [findInventoryReportItemByCurrentDate] inventoryReport:`, inventoryReport);
    return inventoryReport;
}

const insertInventoryReportItem = async (columnName, stockId, initialSale, value, closingAmount) => {
    const { rowCount } = await poolQuery(`
        INSERT INTO inventory_reports(stock_id, opening_sale, ${columnName}, closing)
        VALUES ($1, $2, $3, $4);
    `, [stockId, initialSale, value, closingAmount]);

    if(rowCount === 0) throw new Error(`Error :Insert Inventory Report in insertInventoryReportItem `);

    console.log("Insert Inventory Report Successfully");
};

const insertOpenCloseInventoryReport = async (stockItems) => {
    if (!Array.isArray(stockItems) || stockItems.length === 0) {
        throw new Error("Invalid data array provided.");
    }

    // Create a parameterized query dynamically
    const values = [];
    const placeholders = stockItems.map((_, index) => {
        const offset = index * 3; // Each row has 3 parameters (stockId, opening_sale, closing)
        values.push(_.id, _.inventory_sale, _.inventory_sale);
        return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
    }).join(", ");

    const query = `
        INSERT INTO inventory_reports (stock_id, opening_sale, closing)
        VALUES ${placeholders};
    `;

    const { rowCount } = await poolQuery(query, values);

    if(rowCount === 0) throw new Error(`Error :Insert Inventory Report in insertInventoryReportItem `);

    console.log("Insert Inventory Report Successfully");
}

const updateInventoryReportItem = async (columnName, value, closingAmount, inventoryReportId) => {
    const { rowCount } = await poolQuery(`
        UPDATE inventory_reports
        SET ${columnName} = $1, closing = $2
        WHERE id = $3;
    `, [value, closingAmount, inventoryReportId]);

    if(rowCount === 0) throw new Error(`Error :Update Inventory Report in insertInventoryReportItem `);

    console.log("Update Inventory Report Successfully");
}

module.exports = { findInventoryReportItemByDateAndStockId, findInventoryReportItemByCurrentDate, insertInventoryReportItem, insertOpenCloseInventoryReport, updateInventoryReportItem };