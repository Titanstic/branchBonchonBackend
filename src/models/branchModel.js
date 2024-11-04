const poolQuery = require("../../misc/poolQuery");

const findBranch = async () => {
    const result =  await poolQuery(`SELECT * FROM branches `);

    if(result.rows.length > 0) {
        return result.rows[0];
    }else{
        throw new Error("No Branch Data");
    }
}

const findBranchById = async (id) => {
    return await poolQuery(`
        SELECT * FROM branches WHERE id = $1
    `, [id]);
};

const findCurrentBranch = async () => {
    const branchData = await poolQuery(`SELECT id,ip_address, branch_name  FROM branches`);

    if(branchData.rows.length === 0){
        console.error(`[utils] findCurrentBranch Error: No Branch Data`);
        throw new Error("No Branch Data");
    }

    console.log(`[utils] findCurrentBranch : ${JSON.stringify(branchData.rows)}`);
    return branchData.rows[0];
};


module.exports = { findBranch, findBranchById, findCurrentBranch };