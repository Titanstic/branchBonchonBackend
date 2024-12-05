require('dotenv').config();
const { port, posPort, dashboardPort} = require("./config");

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
const stockRouter = require("./src/controllers/stock/stockController");
const dailySaleReportRouter = require("./src/controllers/reports/dailySaleReportController");
const groupSaleReportRouter = require("./src/controllers/reports/groupSaleReportController");
const groupDetailSaleReportRouter = require("./src/controllers/reports/groupDetailReportController");
const cashierDrawerRouter = require("./src/controllers/cashierDrawerController");
const dashboardRouter = require("./src/controllers/dashboardController");
const twoTableHasuraSyncRouter = require("./src/controllers/sync/twoTableSyncController");
const notificationRouter = require("./src/controllers/notificationController");
const inventoryRouter = require("./src/controllers/stock/inventoryController");
const transferInOutRouter = require("./src/controllers/stock/transferInOutController");
const couponRouter = require("./src/controllers/couponController");

app.use("/signin", signInRouter);
app.use("/transition", transitionRouter);
app.use('/central/sync', CentralHasuraSyncRouter);
app.use("/stockControl", stockRouter);
app.use("/dailySaleReport", dailySaleReportRouter);
app.use("/groupSaleReport", groupSaleReportRouter);
app.use("/groupDetailSaleReport", groupDetailSaleReportRouter);
app.use("/cashierDrawer", cashierDrawerRouter);
app.use("/dashboard", dashboardRouter);
app.use("/central", twoTableHasuraSyncRouter);
app.use("/notification", notificationRouter);
app.use("/inventory", inventoryRouter);
app.use("/transferInOut", transferInOutRouter);
app.use("/coupon", couponRouter);
// End API CALL

// Start Frontend Static
const frontendPosStatic = require("./FrontendPosStatic");
const frontendDashboardStatic = require("./FrontendDashboardStatic");
// End Frontend Static

// const serverStart = async () => {
    app.listen((port || 3002) , () => {
        console.log(`Express server listening on ports ${port || 3002}`);
    })

//     frontendPosStatic.listen(posPort || 4000 , () => {
//         console.log(`POS is running at port ${posPort}`);
//     })
//
//     frontendDashboardStatic.listen(dashboardPort || 5000, () => {
//         console.log(`Dashboard is running at port ${dashboardPort || 5000}`);
//     })
// };
//
// module.exports = serverStart;