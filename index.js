require('dotenv').config();

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { signInRouter} = require("./src/signIn");
const transitionRouter = require("./src/sync/transition");
const ReprintRouter = require("./src/sync/reprint");
const CentralHasuraSyncRouter = require("./src/sync/centralHasuraSync");
const calculateStockRouter = require("./src/calculateStock");
const stockOrderRouter = require("./src/sync/stockOrder");
const dailySaleReportRouter = require("./src/report/DailySale/dailySaleReportController");
const groupSaleReportRouter = require("./src/report/GroupSale/groupSaleReportController");
const groupDetailSaleReportRouter = require("./src/report/GroupSale/groupDetailReportController");

app.use("/signin", signInRouter);
app.use("/transition", transitionRouter);
app.use("/reprint", ReprintRouter);
app.use('/central/sync', CentralHasuraSyncRouter);
app.use("/calculatestock", calculateStockRouter);
app.use("/stockorder", stockOrderRouter);
app.use("/dailySaleReport", dailySaleReportRouter);
app.use("/groupSaleReport", groupSaleReportRouter);
app.use("/groupDetailSaleReport", groupDetailSaleReportRouter);


const PORT = process.env.PORT || 3002;
app.listen((PORT) , () => {
    console.log(`Express server listening on ports ${PORT}`);
})