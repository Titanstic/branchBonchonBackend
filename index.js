require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: '*'}));

// Start API CALL
const signInRouter = require("./src/controllers/signInController");
const transitionRouter = require("./src/controllers/transactionController");
const CentralHasuraSyncRouter = require("./src/controllers/centralHasuraSyncController");
const stockRouter = require("./src/controllers/stockController");
const dailySaleReportRouter = require("./src/controllers/reports/dailySaleReportController");
const groupSaleReportRouter = require("./src/controllers/reports/groupSaleReportController");
const groupDetailSaleReportRouter = require("./src/controllers/reports/groupDetailReportController");
const cashierDrawerRouter = require("./src/controllers/cashierDrawerController");

app.use("/signin", signInRouter);
app.use("/transition", transitionRouter);
app.use('/central/sync', CentralHasuraSyncRouter);
app.use("/stock", stockRouter);
app.use("/dailySaleReport", dailySaleReportRouter);
app.use("/groupSaleReport", groupSaleReportRouter);
app.use("/groupDetailSaleReport", groupDetailSaleReportRouter);
app.use("/cashierDrawer", cashierDrawerRouter);
// End API CALL

// Start Frontend Static
const frontendPosStatic = require("./FrontendPosStatic");
const frontendDashboardStatic = require("./FrontendDashboardStatic");
// End Frontend Static


const PORT = process.env.PORT || 3002;

// const serverStart = async () => {
    app.listen((PORT) , () => {
        console.log(`Express server listening on ports ${PORT}`);
    })

//     frontendPosStatic.listen(4000, () => {
//         console.log(`POS is running at port ${4000}`);
//     })
//
//     frontendDashboardStatic.listen(5000, () => {
//         console.log(`Dashboard is running at port 5000`);
//     })
// };

// module.exports = serverStart;