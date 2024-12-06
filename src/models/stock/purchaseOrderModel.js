const poolQuery = require("../../../misc/poolQuery");

const getLastDocNo = async (tableName) => {
    const { rows: purchaseOrder } = await poolQuery(`
        SELECT doc_no, created_at FROM ${tableName}
        ORDER BY created_at DESC LIMIT 1;
    `);

    if(purchaseOrder.length > 0){
        const newDocNo = Number(purchaseOrder[0].doc_no.split(" ")[1].slice(2)) + 1;
        console.log(`purchaseOrderModel [getLastDocNo] newDocNo:`, newDocNo);
        return newDocNo.toString().padStart(6, "0");
    }else{
        console.log(`purchaseOrderModel [getLastDocNo] newDocNo: new Doc No : 000001`,);
        return "000001";
    }
};

module.exports = { getLastDocNo };