const {findSyncHistoryByColumnId, insertSyncHistoryData, deleteSyncHistoryDataByColumnId} = require("../models/syncModel");

const filterSyncHistory = async (query, variables, event) => {
    const action = event.op;
    const columnId = event.data.new ? event.data.new.id : event.data.old.id;

    try{
        if(action === "DELETE"){
            const syncData = await findSyncHistoryByColumnId(columnId);
            console.log('utils [filterSyncHistory] syncData:', syncData);

            if(syncData){
                await deleteSyncHistoryDataByColumnId(columnId);
            }else {
                await insertSyncHistoryData(query, variables, action, columnId);
            }
        }else{
            await insertSyncHistoryData(query, variables, action, columnId);
        }
    }catch (e) {
        throw new Error(e.message);
    }

};

module.exports = { filterSyncHistory }