const poolQuery = require("../../../misc/poolQuery");

const getComboSetByTransactionId = async (transactionId) => {
    const {rows: transactionComboSet} = await poolQuery(`
        SELECT
            ti.*
        FROM transaction_items AS ti
        LEFT JOIN transaction_combo_set AS tcs
            ON ti.transition_combo_set_id = tcs.id
        WHERE tcs.transaction_id = $1;`,
        [transactionId]
    );

    return transactionComboSet;
};

module.exports = { getComboSetByTransactionId };