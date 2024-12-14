const poolQuery = require("../../misc/poolQuery.js");

const getPermissionByRoleId = async (roleId) => {
    const {rows: permissions} = await poolQuery(`
        SELECT 
            p.permission_name
        FROM permission AS p
        LEFT JOIN role_permission AS rp
            ON p.id = rp.permission_id
        WHERE rp.role_id = $1;
    `, [roleId]);

    console.log(`Permission Model [getPermissionByRoleId] permissions: `, permissions.map(each => each.permission_name));
    return permissions.map(each => each.permission_name);
};

module.exports = { getPermissionByRoleId };