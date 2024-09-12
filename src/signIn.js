const poolQuery = require("../misc/poolQuery.js");
const express = require("express");
const jwt = require("jsonwebtoken");
const {jwttokenkey,jwtExpTime} = require("../config");

const bcrypt = require('bcryptjs');

const signInRouter = express.Router();

signInRouter.post("/", async(req,res)=>{
    try{
        const {username,password} =  req.body.input ? req.body.input: req.body
        const token = await signIn(username,password);

        console.log(`[signInRouter] : `, token)
        res.json({error:0,message:"login Successful",accessToken:token});
    }catch(e){
        console.error(`[signInRouter] Error: `, e.message);
        res.json({error:1,message:e.message,accessToken:""});
    }
})

const signIn = async(username,password)=>{
    try{
        const result = await poolQuery(`SELECT * FROM employees WHERE username = $1 and active = true `, [username]);
        if (result.rowCount == 0){
            throw new Error("username  is not registered or user is suspended");
        }
        const rightPassword = result.rows[0].password;
        const userId = result.rows[0].id;

        const passwordStatus = await bcrypt.compare(password,rightPassword);
        if (passwordStatus == false){
            throw new Error("wrong password");
        }

        const branchResult = await poolQuery(`SELECT * FROM branches WHERE id = $1 `, [result.rows[0].branch_id]);
        const token = await jwtCreator(userId,result.rows[0].level, branchResult.rows[0].id, branchResult.rows[0].branch_name);
        return token;
    }catch(e){
        throw new Error(e.message);
    }
};


const jwtCreator = async (id,role, branchId, branchName)=>{
    const hasura = {};
    hasura["all_roles"] = [role];
    hasura["x-hasura-default-role"] =role;
    hasura["x-hasura-allowed-roles"]= [role];
    hasura["x-hasura-user-id"]=`${id}`;
    return jwt.sign({"https://hasura.io/jwt/claims": hasura, user_id: id, branchId, branchName}, jwttokenkey, {expiresIn: jwtExpTime});
};

module.exports = { jwtCreator, signInRouter }