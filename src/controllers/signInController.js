const express = require("express");
const {generateToken} = require("../models/employeeModel");

const signInController = express.Router();

signInController.post("/", async(req,res)=>{
    try{
        const {username,password} =  req.body.input ? req.body.input: req.body
        const token = await generateToken(username,password);

        console.log(`[signInRouter] : `, token)
        res.json({error:0,message:"login Successful",accessToken:token});
    }catch(e){
        console.error(`[signInRouter] Error: `, e.message);
        res.json({error:1,message:e.message,accessToken:""});
    }
})

module.exports =  signInController;