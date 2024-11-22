const poolQuery = require("../../misc/poolQuery");

const findPaymentTypeById = async (paymentTypeId) => {
    const { rows: paymentTypeData } = await poolQuery(`
        SELECT * FROM payment_types 
        WHERE id = $1;
        `, [paymentTypeId]
    );

    if(paymentTypeData.length === 0){
        throw  new Error("Payment Type data Not found by id");
    }

    return paymentTypeData[0];
};

module.exports = { findPaymentTypeById };