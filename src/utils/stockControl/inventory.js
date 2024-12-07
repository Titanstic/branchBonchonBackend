const {findInventoryReportItemByDate, insertInventoryReportItem, updateInventoryReportItem} = require("../../models/stock/inventoryReportsModel");
const {findTransactionItemsByTransactionId} = require("../../models/transaction/transactionItemModel");
const {calculateStock} = require("./stock");
const {getComboSetByTransactionId} = require("../../models/transaction/transactionComboSetModel");
const {getStockItemAndRecipeByMenuId, updateStockQtyById} = require("../../models/stock/stockItemsModel");
const {reduceRecipeUnit} = require("./recipeUnit");

const filterInventoryReport = async (stockId, tableName, initialSale, newInventoryQty) => {
    const getInventoryReport = await findInventoryReportItemByDate(stockId, tableName);
    initialSale = initialSale.toFixed(2);
    newInventoryQty = newInventoryQty.toFixed(2);

    if(getInventoryReport.length > 0) {
        console.log(getInventoryReport[0]);
        await updateInventoryReport(tableName, getInventoryReport, initialSale, newInventoryQty);
    }else{
        await insertInventoryReport(tableName, getInventoryReport, initialSale, newInventoryQty, stockId);
    }
};

const insertInventoryReport = async (tableName, getInventoryReport, initialSale, newInventoryQty, stockId) => {
    let newClosingSale = initialSale;

    switch (tableName) {
        case "good_received_item":
            newClosingSale += newInventoryQty;
            await insertInventoryReportItem("receiving_sale", stockId, initialSale, newInventoryQty, newClosingSale);
            break;
        case "good_return_item":
            newClosingSale -= Math.abs(newInventoryQty);
            await insertInventoryReportItem("good_return", stockId, initialSale, newInventoryQty, newClosingSale);
            break;
        case "transfer_in" :
        case "transfer_in_items" :
            newClosingSale += Math.abs(newInventoryQty);
            await insertInventoryReportItem("transfer_in", stockId, initialSale, newInventoryQty, newClosingSale);
            break;
        case "transfer_out" :
        case "transfer_out_items":
            newClosingSale -= Math.abs(newInventoryQty);
            await insertInventoryReportItem("transfer_out", stockId, initialSale, newInventoryQty, newClosingSale);
            break;
        case "usage" :
        case "raw":
            newClosingSale -= Math.abs(newInventoryQty);
            await insertInventoryReportItem(tableName, stockId, initialSale, newInventoryQty, newClosingSale);
            break;
        case "adjustment" :
            newClosingSale = newInventoryQty > 0
                ? newClosingSale +  Math.abs(newInventoryQty)
                : newClosingSale -  Math.abs(newInventoryQty);
            await insertInventoryReportItem(tableName, stockId, initialSale, newInventoryQty, newClosingSale);
            break;
        case "sales" :
            newClosingSale = newInventoryQty > 0
                ? newClosingSale +  Math.abs(newInventoryQty)
                : newClosingSale -  Math.abs(newInventoryQty);
            await insertInventoryReportItem(tableName, stockId, initialSale, newInventoryQty, newClosingSale);
            break;
        case "finish":
            newClosingSale -= Math.abs(newInventoryQty);
            await insertInventoryReportItem(tableName, stockId, initialSale, newInventoryQty, newClosingSale);
            break;
    }
}

const updateInventoryReport = async (tableName, getInventoryReport, initialSale, newInventoryQty) => {
    let newClosingSale = getInventoryReport.length > 0 ? getInventoryReport[0].closing : initialSale;

    switch (tableName) {
        case "good_received_item":
            const newReceivingSale = getInventoryReport[0].receiving_sale + newInventoryQty;
            newClosingSale += newInventoryQty;
            await updateInventoryReportItem("receiving_sale", newReceivingSale, newClosingSale, getInventoryReport[0].id);
            break;
        case "good_return_item":
            const newReturnSale = getInventoryReport[0].good_return + newInventoryQty;
            newClosingSale -= Math.abs(newInventoryQty);
            await updateInventoryReportItem("good_return", newReturnSale, newClosingSale, getInventoryReport[0].id);
            break;
        case "transfer_in" :
        case "transfer_in_items" :
            const newTransferInSale = getInventoryReport[0].transfer_in + newInventoryQty;
            newClosingSale += Math.abs(newInventoryQty);
            await updateInventoryReportItem("transfer_in", newTransferInSale, newClosingSale, getInventoryReport[0].id);
            break;
        case "transfer_out" :
        case "transfer_out_items":
            const newTransferOutSale = getInventoryReport[0].transfer_out + newInventoryQty;
            newClosingSale -= Math.abs(newInventoryQty);
            await updateInventoryReportItem("transfer_out", newTransferOutSale, newClosingSale, getInventoryReport[0].id);
            break;
        case "usage" :
        case "raw":
            const newWasteSale = getInventoryReport[0][tableName] + newInventoryQty;
            newClosingSale -= Math.abs(newInventoryQty);
            await updateInventoryReportItem(tableName, newWasteSale, newClosingSale, getInventoryReport[0].id);
            break;
        case "adjustment":
            const newAdjustmentSale = getInventoryReport[0][tableName] + newInventoryQty;
            newClosingSale = newInventoryQty > 0
                ? newClosingSale +  Math.abs(newInventoryQty)
                : newClosingSale -  Math.abs(newInventoryQty);
            await updateInventoryReportItem(tableName, newAdjustmentSale, newClosingSale, getInventoryReport[0].id);
            break;
        case "sales":
            const newSale =  newInventoryQty > 0
                ? getInventoryReport[0][tableName] + Math.abs(newInventoryQty)
                : getInventoryReport[0][tableName] - Math.abs(newInventoryQty);
            newClosingSale = newInventoryQty > 0
                ? newClosingSale +  Math.abs(newInventoryQty)
                : newClosingSale -  Math.abs(newInventoryQty);
            await updateInventoryReportItem(tableName, newSale, newClosingSale, getInventoryReport[0].id);
            break;
        case "finish":
            const newFinishWasteSale = getInventoryReport[0][tableName] + newInventoryQty;
            newClosingSale -= Math.abs(newInventoryQty);
            await updateInventoryReportItem(tableName, newFinishWasteSale, newClosingSale, getInventoryReport[0].id);
            break;
    }
};

const calculateFinishStockItem = async (normalMenuId, isTakeAway, tableName, menuQty ) => {
    const stockItemData = await getStockItemAndRecipeByMenuId(normalMenuId, isTakeAway, menuQty);
    console.log(`utils inventory [calculateStockItem] stockItemData:`, stockItemData);

    for (const item of stockItemData) {
        const currentQty = reduceRecipeUnit(item);

        await updateStockQtyById(currentQty, item.stock_id);

        //    add or update inventory report
        const openingSale = (item.uom_recipe_unit ? item.current_qty / item.s_recipe_qty : item.current_qty).toFixed(2);
        const inventoryQty = -(item.uom_recipe_unit ? item.used_recipe_qty / item.s_recipe_qty : item.used_recipe_qty).toFixed(2);

        await filterInventoryReport(item.stock_id, tableName, openingSale, inventoryQty);
    }
}

module.exports = { filterInventoryReport, calculateFinishStockItem };