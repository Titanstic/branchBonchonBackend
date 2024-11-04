const jwt = require("jsonwebtoken");
const {jwttokenkey, jwtExpTime} = require("../../config");

const jwtCreator = async (id,role, branchId, branchName)=>{
    const hasura = {};
    hasura["all_roles"] = [role];
    hasura["x-hasura-default-role"] =role;
    hasura["x-hasura-allowed-roles"]= [role];
    hasura["x-hasura-user-id"]=`${id}`;
    return jwt.sign({"https://hasura.io/jwt/claims": hasura, user_id: id, branchId, branchName}, jwttokenkey, {expiresIn: jwtExpTime});
};

module.exports = { jwtCreator };