const poolQuery = require("../../../misc/poolQuery");
const {executeCentralMutationWithoutEvent} = require("../../utils/mutation");

const getInventoryReportByDate = async (startDate, endDate) => {
    const { rows: inventoryReport } = await poolQuery(`
        WITH aggregated_sales AS (
            SELECT
                ir.stock_id,
                SUM(ir.receiving_sale) AS receiving_sale,
                SUM(ir.good_return) AS good_return,
                SUM(ir.transfer_in) AS transfer_in,
                SUM(ir.sales) AS sales,
                SUM(ir.usage) AS usage,
            SUM(ir.transfer_out) AS transfer_out,
            SUM(ir.finish) AS finish,
            SUM(ir.adjustment) AS adjustment,
            SUM(ir.raw) AS raw
        FROM inventory_reports AS ir
        WHERE DATE(ir.created_at) BETWEEN $1 AND $2
        GROUP BY ir.stock_id
            ),
            opening_closing AS (
        SELECT DISTINCT ON (ir.stock_id)
            ir.stock_id,
            FIRST_VALUE(ir.opening_sale) OVER (
            PARTITION BY ir.stock_id ORDER BY ir.created_at ASC
            ) AS opening_sale,
            FIRST_VALUE(ir.closing) OVER (
            PARTITION BY ir.stock_id ORDER BY ir.created_at DESC
            ) AS closing
        FROM inventory_reports AS ir
        WHERE DATE(ir.created_at) BETWEEN $3 AND $4
            )
        SELECT DISTINCT
            si.name AS stock_name,
            si.code_no,
            sid.name AS department_name,
            sig.name AS group_name,
            sit.name AS type_name,
            iu.inventory_name,
            oc.opening_sale,
            ags.good_return,
            ags.receiving_sale,
            ags.transfer_in,
            ags.sales,
            ags.usage,
            ags.transfer_out,
            ags.finish,
            ags.adjustment,
            ags.raw,
            oc.closing
        FROM stock_items AS si
                 LEFT JOIN aggregated_sales AS ags ON si.id = ags.stock_id
                 LEFT JOIN opening_closing AS oc ON si.id = oc.stock_id
                 LEFT JOIN stock_items_department AS sid ON si.department_id = sid.id
                 LEFT JOIN stock_items_group AS sig ON si.group_id = sig.id
                 LEFT JOIN stock_items_type AS sit ON si.type_id = sit.id
                 LEFT JOIN inventory_units AS iu ON si.inventory_unit_id = iu.id
        WHERE oc.opening_sale IS NOT NULL OR oc.closing IS NOT NULL
        ORDER BY si.name ASC;
    `, [startDate, endDate, startDate, endDate]);

    return inventoryReport;
}

const getLastDocNo = async (tableName, branchId) => {
    let inventory = [];

    if(tableName === "transfer_in" || tableName === "transfer_out"){
        const query = tableName === "transfer_in"
            ? `
            query MyQuery($branchId: uuid!) {
                  transfer_in(order_by: {created_at: desc}, limit: 1, where: {branch_in_id: {_eq: $branchId}}) {
                        doc_no
                  }
            }`
            : `
            query MyQuery($branchId: uuid!) {
                  transfer_out(order_by: {created_at: desc}, limit: 1, where: {branch_out_id: {_eq: $branchId}}) {
                        doc_no
                  }
            }
            `
        ;
        const variables = { branchId };
        const resData = await executeCentralMutationWithoutEvent(query, variables);
        inventory = resData[tableName];
    }else{
        const { rows: docNoRes } = await poolQuery(`
            SELECT doc_no, created_at FROM ${tableName}
            ORDER BY created_at DESC LIMIT 1;
        `);
        inventory = docNoRes;
    }


    if(inventory.length > 0){
        const newDocNo = Number(inventory[0].doc_no.split(" ")[1].slice(2)) + 1;
        console.log(`inventoryModel [getLastDocNo] newDocNo:`, newDocNo);
        return newDocNo.toString().padStart(6, "0");
    }else{
        console.log(`inventoryModel [getLastDocNo] newDocNo: new Doc No : 000001`,);
        return "000001";
    }
};

module.exports = { getInventoryReportByDate, getLastDocNo };