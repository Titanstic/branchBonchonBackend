const poolQuery =  require("../../misc/poolQuery");


const deleteHasuraEventLog = async () => {
    const { rowCount } = await poolQuery(`DELETE FROM hdb_catalog.event_log WHERE created_at > NOW() - INTERVAL '7 days';`);

    console.log(`dbCleanMode [deleteHasuraEventLog] rowCount:`, rowCount);

    return rowCount;
}

module.exports = { deleteHasuraEventLog };