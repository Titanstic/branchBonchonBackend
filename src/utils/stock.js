const filterStockItemQty = (tableName, stockItemData, inputData) => {
    let updateInventoryQty = 0;
    switch (tableName){
        case "good_received_item":
            updateInventoryQty = stockItemData.inventory_qty + inputData.qty;
            break;
        case "waste_details":
            updateInventoryQty = stockItemData.inventory_qty - inputData.qty;
            break;
    }

    return { updateInventoryQty };
};

module.exports = { filterStockItemQty };