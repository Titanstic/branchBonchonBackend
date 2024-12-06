const poolQuery = require("../../../misc/poolQuery");

const findInventoryReportItemByDate = async (stockId) => {
    const { rows: inventoryReport } = await poolQuery(`
        SELECT * FROM inventory_reports
        WHERE DATE(created_at) = CURRENT_DATE AND stock_id = $1;
    `, [stockId]);

    return inventoryReport;
};

module.exports = { findInventoryReportItemByDate };