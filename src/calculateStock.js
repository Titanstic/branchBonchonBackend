const express = require("express");
const calculateStockRouter = express.Router();

const poolQuery = require("../misc/poolQuery.js");

calculateStockRouter.post("/", async (req, res) => {
    const event = req.body.event;
    const transitionId = event.data.new.id;

    try{
        const resMessage = await poolQuery(`SELECT * FROM public.stock_reduce($1);`, [transitionId]);

        res.status(200).json({ success: true, message: resMessage});
    }catch (e) {
        res.status(500).json({ success: true, message: e.message});
    }
});

module.exports = calculateStockRouter;