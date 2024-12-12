const poolQuery = require("../../../misc/poolQuery");

const insertTransactionDetail = async (appName, amount, couponId, memberId, transactionId) => {
    const { rowCount } = await poolQuery(`
        INSERT INTO transaction_details(name, amount, coupon_id, member_id, transaction_id)
        VALUES ($1, $2, $3, $4, $5)
    `, [appName, amount, couponId, memberId, transactionId]);

    if(rowCount === 0){
        throw new Error(`Insert Transaction Detail error for ${appName}`);
    }

    console.log("[insertTransactionDetail] Insert Transaction Detail successfully");
};

module.exports = { insertTransactionDetail };