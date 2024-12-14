const poolQuery = require("../../misc/poolQuery");
const bcrypt = require("bcryptjs");
const {jwtCreator} = require("../utils/employee");
const {getPermissionByRoleId} = require("./permissionModel");

const generateToken = async(username,password)=>{
    try{
        const result = await poolQuery(`
            SELECT
                e.*,
                r.id AS role_id,
                r.name AS role_name
            FROM employees AS e
            LEFT JOIN roles AS r
                ON e.role_id = r.id
            WHERE e.username = $1 and e.active = true;
        `, [username]);

        if (result.rowCount === 0){
            throw new Error("username  is not registered or user is suspended");
        }
        const rightPassword = result.rows[0].password;
        const userId = result.rows[0].id;

        const passwordStatus = await bcrypt.compare(password,rightPassword);
        if (passwordStatus === false){
            throw new Error("wrong password");
        }

        const permissions = await getPermissionByRoleId(result.rows[0].role_id);
        const branchResult = await poolQuery(`SELECT * FROM branches`);
        const token = await jwtCreator(userId, "admin", branchResult.rows[0].id, branchResult.rows[0].branch_name, permissions);
        return token;
    }catch(e){
        throw new Error(e.message);
    }
};

const findEmployeeById = async (id) => {
    const { rows: employeeData } = await poolQuery(`SELECT username, printer_name FROM employees WHERE id = $1;`, [id]);

    if(employeeData.length > 0){
        console.log(`[utils] findEmployeeById : ${employeeData[0].username} ${employeeData[0].printer_name}`);
        return employeeData[0];
    }else{
        throw new Error("Employee does not exist");
    }
}

module.exports = { generateToken, findEmployeeById };