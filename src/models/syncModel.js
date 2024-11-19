const poolQuery = require("../../misc/poolQuery");

const findSyncHistoryByColumnId = async (columnId) => {
    console.log(`syncModel [findSyncHistoryByColumnId] columnId: ${columnId}`);

    const { rows: syncData } = await poolQuery(`SELECT id FROM sync_history WHERE column_id = $1;`,[columnId]);

    if(syncData.length > 0){
        return syncData;
    }
}

const insertSyncHistoryData = async (query, variables, action, columnId) => {
     await poolQuery(`
        INSERT INTO sync_history(query, variables, action, column_id)
        VALUES ($1, $2, $3, $4)
    `, [query, variables, action, columnId]);
};

const deleteSyncHistoryDataByColumnId = async (columnId) => {
    console.log(`syncModel [deleteSyncHistoryDataByColumnId] columnId: ${columnId}`);

    await poolQuery(`DELETE FROM sync_history WHERE column_id = $1;`, [columnId]);
}

module.exports = { findSyncHistoryByColumnId, insertSyncHistoryData, deleteSyncHistoryDataByColumnId};