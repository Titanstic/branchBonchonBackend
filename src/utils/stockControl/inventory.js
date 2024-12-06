const {findInventoryReportItemByDate} = require("../../models/stock/inventoryReportsModel");

const filterInventoryReport = async (stockId, tableName) => {
    const getInventoryReport = await findInventoryReportItemByDate(stockId, tableName);
    console.log(getInventoryReport);

    if(getInventoryReport.length > 0) {
        console.log("update");

    }else{
        console.log("insert");

        switch (tableName) {
            case "good_received":
                const receiving_sale = 0;
                break;
            case "good_return":
                break;
            case "transfer_in":
                break;
            case "transfer_out":
                break;
        }
    }
};

module.exports = { filterInventoryReport };