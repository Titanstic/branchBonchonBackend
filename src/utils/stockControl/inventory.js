const {findInventoryReportItemByDate, insertInventoryReportItem, updateInventoryReportItem} = require("../../models/stock/inventoryReportsModel");
const {findTransactionItemsByTransactionId} = require("../../models/transaction/transactionItemModel");
const {calculateStock} = require("./stock");
const {getComboSetByTransactionId} = require("../../models/transaction/transactionComboSetModel");
const {getStockItemAndRecipeByMenuId, updateStockQtyById} = require("../../models/stock/stockItemsModel");
const {reduceRecipeUnit} = require("./recipeUnit");

const filterInventoryReport = async (stockId, tableName, initialSale, newInventoryQty) => {
    const getInventoryReport = await findInventoryReportItemByDate(stockId, tableName);

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
            console.log(newClosingSale);
            await insertInventoryReportItem("receiving_sale", stockId, initialSale.toFixed(2), newInventoryQty.toFixed(2), newClosingSale.toFixed(2));
            break;
        case "good_return_item":
            newClosingSale -= Math.abs(newInventoryQty);
            await insertInventoryReportItem("good_return", stockId, initialSale.toFixed(2), newInventoryQty.toFixed(2), newClosingSale.toFixed(2));
            break;
        case "transfer_in" :
        case "transfer_in_items" :
            newClosingSale += Math.abs(newInventoryQty);
            await insertInventoryReportItem("transfer_in", stockId, initialSale.toFixed(2), newInventoryQty.toFixed(2), newClosingSale.toFixed(2));
            break;
        case "transfer_out" :
        case "transfer_out_items":
            newClosingSale -= Math.abs(newInventoryQty);
            await insertInventoryReportItem("transfer_out", stockId, initialSale.toFixed(2), newInventoryQty.toFixed(2), newClosingSale.toFixed(2));
            break;
        case "usage" :
        case "raw":
            newClosingSale -= Math.abs(newInventoryQty);
            await insertInventoryReportItem(tableName, stockId, initialSale.toFixed(2), newInventoryQty.toFixed(2), newClosingSale.toFixed(2));
            break;
        case "adjustment" :
            newClosingSale = newInventoryQty > 0
                ? newClosingSale +  Math.abs(newInventoryQty)
                : newClosingSale -  Math.abs(newInventoryQty);
            await insertInventoryReportItem(tableName, stockId, initialSale.toFixed(2), newInventoryQty.toFixed(2), newClosingSale.toFixed(2));
            break;
        case "sales" :
            newClosingSale = newInventoryQty > 0
                ? newClosingSale +  Math.abs(newInventoryQty)
                : newClosingSale -  Math.abs(newInventoryQty);
            await insertInventoryReportItem(tableName, stockId, initialSale.toFixed(2), newInventoryQty.toFixed(2), newClosingSale.toFixed(2));
            break;
        case "finish":
            newClosingSale -= Math.abs(newInventoryQty);
            await insertInventoryReportItem(tableName, stockId, initialSale.toFixed(2), newInventoryQty.toFixed(2), newClosingSale.toFixed(2));
            break;
    }
}

const updateInventoryReport = async (tableName, getInventoryReport, initialSale, newInventoryQty) => {
    let newClosingSale = Number(getInventoryReport.length > 0 ? getInventoryReport[0].closing : initialSale);

    switch (tableName) {
        case "good_received_item":
            const newReceivingSale = Number(getInventoryReport[0].receiving_sale) + newInventoryQty;
            newClosingSale += newInventoryQty;
            await updateInventoryReportItem("receiving_sale", newReceivingSale.toFixed(2), newClosingSale.toFixed(2), getInventoryReport[0].id);
            break;
        case "good_return_item":
            const newReturnSale = Number(getInventoryReport[0].good_return) + newInventoryQty;
            newClosingSale -= Math.abs(newInventoryQty);
            await updateInventoryReportItem("good_return", newReturnSale.toFixed(2), newClosingSale.toFixed(2), getInventoryReport[0].id);
            break;
        case "transfer_in" :
        case "transfer_in_items" :
            const newTransferInSale = Number(getInventoryReport[0].transfer_in) + newInventoryQty;
            newClosingSale += Math.abs(newInventoryQty);
            await updateInventoryReportItem("transfer_in", newTransferInSale.toFixed(2), newClosingSale.toFixed(2), getInventoryReport[0].id);
            break;
        case "transfer_out" :
        case "transfer_out_items":
            const newTransferOutSale = Number(getInventoryReport[0].transfer_out) + newInventoryQty;
            newClosingSale -= Math.abs(newInventoryQty);
            await updateInventoryReportItem("transfer_out", newTransferOutSale.toFixed(2), newClosingSale.toFixed(2), getInventoryReport[0].id);
            break;
        case "usage" :
        case "raw":
            const newWasteSale = Number(getInventoryReport[0][tableName]) + newInventoryQty;
            newClosingSale -= Math.abs(newInventoryQty);
            await updateInventoryReportItem(tableName, newWasteSale.toFixed(2), newClosingSale.toFixed(2), getInventoryReport[0].id);
            break;
        case "adjustment":
            const newAdjustmentSale = Number(getInventoryReport[0][tableName]) + newInventoryQty;
            newClosingSale = newInventoryQty > 0
                ? newClosingSale +  Math.abs(newInventoryQty)
                : newClosingSale -  Math.abs(newInventoryQty);
            await updateInventoryReportItem(tableName, newAdjustmentSale.toFixed(2), newClosingSale.toFixed(2), getInventoryReport[0].id);
            break;
        case "sales":
            const newSale =  newInventoryQty > 0
                ? Number(getInventoryReport[0][tableName]) + Math.abs(newInventoryQty)
                : Number(getInventoryReport[0][tableName]) - Math.abs(newInventoryQty);
            newClosingSale = newInventoryQty > 0
                ? newClosingSale +  Math.abs(newInventoryQty)
                : newClosingSale -  Math.abs(newInventoryQty);
            await updateInventoryReportItem(tableName, newSale.toFixed(2), newClosingSale.toFixed(2), getInventoryReport[0].id);
            break;
        case "finish":
            const newFinishWasteSale = Number(getInventoryReport[0][tableName]) + newInventoryQty;
            newClosingSale -= Math.abs(newInventoryQty);
            await updateInventoryReportItem(tableName, newFinishWasteSale.toFixed(2), newClosingSale.toFixed(2), getInventoryReport[0].id);
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
        const openingSale = item.uom_recipe_unit ? item.current_qty / item.s_recipe_qty : item.current_qty;
        const inventoryQty = -(item.uom_recipe_unit ? item.used_recipe_qty / item.s_recipe_qty : item.used_recipe_qty);

        await filterInventoryReport(item.stock_id, tableName, openingSale, inventoryQty);
    }
}

module.exports = { filterInventoryReport, calculateFinishStockItem };