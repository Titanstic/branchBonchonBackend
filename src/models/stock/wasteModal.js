const poolQuery = require("../../../misc/poolQuery");

const findWasteTypeById = async (wasteId) => {
    const { rows: wasteData } = await poolQuery(`
        SELECT waste_type FROM wastes
        WHERE id = $1;
    `, [wasteId]);

    if(wasteData.length === 0){
        throw new Error(`Waste Data not found by id.`);
    }

    console.log(`Waste Model [findWasteTypeById] wasteData: `, wasteData[0]);
    return wasteData[0];
};

module.exports = { findWasteTypeById };