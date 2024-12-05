const {addInventoryUnit, reduceInventoryUnit} = require("./inventoryUnit");
const {updateStockQtyById, findStockItemById} = require("../../models/stock/stockItemsModel");

const checkOperationForTransfer =  (tableName, operation, data) => {
    let query = "";
    let variables = {};

    switch (operation){
        case "select":
            query = tableName === "transfer_in" ?
                `query MyQuery($branch_in_id: uuid!) {
                    transfer_in(where: {branch_in_id: {_eq: $branch_in_id}}) {
                        branch_in_id
                        branch_in_name
                        branch_out_id
                        branch_out_name
                        created_at
                        doc_no
                        id
                        note
                        ref_no
                        status
                        transfer_in_date
                        transfer_in_items {
                            created_at
                            id
                            qty
                            stock_id                              
                            stock_item {
                                name
                            }
                            transfer_in_id
                            transfer_qty
                            uom
                            updated_at
                        }
                        transfer_out_do_no
                        updated_at
                    }
                }`
            :
                `query MyQuery($branch_out_id: uuid!) {
                      transfer_out(where: {branch_out_id: {_eq: $branch_out_id}}) {
                            branch_out_id
                            branch_in_id
                            branch_in_name
                            branch_out_name
                            created_at
                            doc_no
                            id
                            note
                            ref_no
                            status
                            transfer_out_items {
                              created_at
                              id
                              qty
                              stock_id
                              transfer_out_id
                              updated_at
                              stock_item {
                                name
                              }
                            }
                            transfrer_out_date
                            updated_at
                          }
                    }
            `;

            variables = { ...data };
            break;
        case "create":
            query = `
                    mutation InsertData($input: ${tableName}_insert_input!) {
                        insert_${tableName}_one(object: $input) {
                            id
                        }
                    }
                `;
            variables= { input: { ...data } };
            break;
        case "update":
            const primaryKey = 'id';
            query = `
                    mutation UpdateData($pk: uuid!, $changes: ${tableName}_set_input!) {
                        update_${tableName}_by_pk(pk_columns: { ${primaryKey}: $pk }, _set: $changes) {
                            id
                        }
                    }
                `;
            variables = { pk: data[primaryKey], changes: { ...data } };
            break;
        case "delete":
            // Mutation to delete data in local Hasura
            const primaryKey2 = 'id'; // replace with the actual primary key of your table
            query = `
                    mutation DeleteData($pk: uuid!) {
                        delete_${tableName}_by_pk(${primaryKey2}: $pk) {
                            id
                        }
                    }
                `;
            variables = { pk: data[primaryKey2] };
            break;
    }

    return { query, variables }
};

const branchDataForTransfer = (id) => {
    let query = `
        query MyQuery($id: uuid!) {
              branches(where: {id: {_neq: $id}}) {
                    id
                    branch_name
              }
        }
    `;
    let variables = { id: id };

    return { query, variables };
}

const filterCalculateStock = async (tableName, inputData, stockItemData) => {
    const isTransferIn = tableName.includes("transfer_in");
    const stockItem = isTransferIn
        ? (tableName === "transfer_in" ? inputData.transfer_in_items.data : inputData)
        : (tableName === "transfer_out" ? inputData.transfer_out_items.data : inputData);

    // Determine the operation function (add or reduce inventory)
    const inventoryOperation = isTransferIn ? addInventoryUnit : reduceInventoryUnit;

    if (Array.isArray(stockItem)) {
        for (const item of stockItem) {
            const stockItemData = await findStockItemById(item.stock_id);

            const currentQty = inventoryOperation(stockItemData, Number(item.qty));
            await updateStockQtyById(currentQty, item.stock_id);
        }
    } else {
        const stockItemData = await findStockItemById(stockItem.stock_id);

        const currentQty =  inventoryOperation(stockItemData, Number(inputData.qty));
        await updateStockQtyById(currentQty, inputData.stock_id);
    }
};

const getTransferOutDoc = (branchInId) => {
    const query =`
    query MyQuery($branchInId: uuid!) {
          transfer_out(where: {branch_in_id: {_eq: $branchInId}, used: {_eq: false}}) {
                doc_no
                ref_no
                transfer_out_items {
                      id
                      qty
                      stock_id
                      updated_at
                      stock_item {
                            name
                            purchase_qty
                            inventory_qty
                            recipe_qty
                      }
                }
                branch_in_id
                branch_out_id
          }
    }
    `;

    const variables = { branchInId };

    return { query, variables };
}

module.exports = { checkOperationForTransfer, branchDataForTransfer, filterCalculateStock, getTransferOutDoc };