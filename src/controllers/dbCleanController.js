const {deleteHasuraEventLog} = require("../models/dbCleanModel");
const {executeCentralMutation, executeBranchMutation} = require("../utils/centralHasuraSync");
const dbCleanController = require("express").Router();

dbCleanController.post("/clean", async (req, res) => {
    try {
        const hasuraEventCount = await deleteHasuraEventLog();

        console.log(`[dbCleanController] :`, "Clean Successfully");
        res.status(200).json({ success: true, message: `SyncHistoryCount's ${syncHistoryCount} and hasuraEventCount's ${hasuraEventCount} Clean Successfully` });
    } catch (e) {
        console.error(`[dbCleanController] Error:`, e.message);
        res.status(500).json({ success: false, message: e.message });
    }
});
//
// dbCleanController.post("/setup", async (req, res) => {
//     const { branchId } = req.body.input ?? req.body;
//
//     try{
//         const { query, variables } = getQueryForSetup(branchId);
//         const getSetUpData = await executeCentralMutation(query, variables);
//         console.log(`[dbCleanController] getSetUpData :`, getSetUpData);
//
//         for (let each in getSetUpData) {
//             console.log(`[dbCleanController] key :`, each);
//             console.log(`[dbCleanController] value :`, getSetUpData[each]);
//             const { insertQuery, insertVariables } = insertQueryAndVar(each, getSetUpData[each]);
//
//             await executeBranchMutation(insertQuery, insertVariables, getSetUpData.branches[0]);
//         }
//
//         res.status(200).json({ success: true, message: "Setup Successfully", data: getSetUpData });
//     }catch (e) {
//         console.error(`[dbCleanController] Error:`, e.message);
//         res.status(500).json({ success: false, message: e.message });
//     }
// })
//
// const getQueryForSetup = (branchId) => {
//     const query = `
//     query MyQuery($branchId: uuid!) {
//           branches(where: {id: {_eq: $branchId}}) {
//             address
//             branch_name
//             branch_no
//             closing_time
//             created_at
//             grand_opening_date
//             id
//             ip_address
//             opening_time
//             phone
//             phone_2
//             road_city
//             serial_no
//             updated_at
//           }
//
//         }
//         `;
//     const variables = { branchId };
//
//     return { query, variables };
// };
//
// const insertQueryAndVar = (tableName, input) => {
//     const insertQuery = `
//                     mutation InsertData($input: [${tableName}_insert_input!]!) {
//                         insert_${tableName}(objects: $input) {
//                             id
//                         }
//                     }
//                 `;
//     const insertVariables= { input };
//
//     return { insertQuery, insertVariables };
// }


dbCleanController.post("/setup", async (req, res) => {
    const { branchId } = req.body.input ?? req.body;

    try {
        const { query, variables } = getQueryForSetup(branchId);
        const getSetUpData = await executeCentralMutation(query, variables);

        for (let key in getSetUpData) {
            const records = getSetUpData[key];

            // Ensure the value is an array before processing
            if (!Array.isArray(records) || records.length === 0) {
                console.warn(`[dbCleanController] Skipping empty or invalid data for key:`, key);
                continue;
            }

            console.log(`[dbCleanController] key :`, key);

            // Prepare insertion mutation
            const { insertQuery, insertVariables } = insertQueryAndVar(key, records);

            // Execute mutation
            await executeBranchMutation(insertQuery, insertVariables, getSetUpData.branches[0]);
        }

        res.status(200).json({ success: true, message: "Setup Successfully" });
    } catch (e) {
        console.error(`[dbCleanController] Error:`, e.message);
        res.status(500).json({ success: false, message: e.message });
    }
});

const getQueryForSetup = (branchId) => {
    const query = `
    query GetBranchData($branchId: uuid!) {
        branches(where: {id: {_eq: $branchId}}) {
            address
            branch_name
            branch_no
            closing_time
            created_at
            grand_opening_date
            id
            ip_address
            opening_time
            phone
            phone_2
            road_city
            serial_no
            updated_at
        }
        employees(where: {branch_id: {_eq: $branchId}}) {
            active
            created_at
            department
            id
            level
            password
            printer_name
            role_id
            updated_at
            username
          }
          family_group {
            created_at
            family_name
            id
            updated_at
          }
          major_group {
            created_at
            id
            major_name
            updated_at
          }
          report_group {
            created_at
            id
            report_name
            updated_at
          }
          stock_items_department {
            created_at
            id
            name
            updated_at
          }
          stock_items_group {
            created_at
            id
            name
            updated_at
          }
          stock_items_type {
            created_at
            id
            name
            updated_at
          }
          inventory_units {
            created_at
            id
            inventory_name
            updated_at
          }
          purchase_units {
            created_at
            id
            purchase_name
            update_at
          }
          recipe_units {
            created_at
            id
            recipe_name
            updated_at
          }
          suppliers {
            address_detail
            city
            created_at
            id
            name
            note
            pri_phone_no
            sec_phone_no
            status
            sup_id
            township
            updated_at
          }
          other_supplier {
            created_at
            id
            password
            show
            updated_at
            username
          }
          permission {
            created_at
            id
            permission_name
            type
            updated_at
          }
          roles {
            created_at
            created_by
            id
            updated_at
            name
          }
          role_permission {
            created_at
            id
            permission_id
            role_id
            updated_at
          }
          stock_items {
            average_purchase_price
            batch_id
            code_no
            created_at
            department_id
            current_qty
            discount
            group_id
            id
            inventory_qty
            inventory_unit_id
            last_purchase_price
            low_stock_qty
            name
            purchase_qty
            purchase_unit_id
            recipe_qty
            recipe_unit_id
            supplier_id
            tax_id
            type_id
            unit_id
            updated_at
          }
    }`;

    return { query, variables: { branchId } };
};

const insertQueryAndVar = (tableName, input) => {
    const insertQuery = `
        mutation InsertData($input: [${tableName}_insert_input!]!) {
            insert_${tableName}(objects: $input) {
                returning {
                    id
                }
            }
        }
    `;

    return { insertQuery, insertVariables: { input } };
};

module.exports = dbCleanController;