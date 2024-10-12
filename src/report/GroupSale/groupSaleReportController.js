const express = require("express");
const groupSaleReportRouter = express.Router();

const {getGroupSaleReport} = require("./groupReportModel");

groupSaleReportRouter.post("/", async (req, res) => {
    let {startDate, endDate, page} = req.body.input ? req.body.input : req.body;
    startDate += " 00:00:00" ;
    endDate += " 23:59:59";
    const offset = (page - 1) * 10;
    console.log('groupSaleReportRouter :', startDate, endDate, offset);

    try{
        const { groupSaleReports, totalGroupSaleReports } = await getGroupSaleReport(startDate, endDate, offset);
        const dataReport = [ { pages: Math.ceil(totalGroupSaleReports.length/10)}, { groupSaleReports }];

        console.log('groupSaleReportRouter dataReport:',dataReport);
        res.status(200).json({ error: 0, message: JSON.stringify(dataReport)});
    }catch (e) {
        console.error('groupSaleReportRouter error:', e.message);
        res.status(500).json({ error: 1, message: e.message});
    }
});


groupSaleReportRouter.post("/download", async (req, res) => {
    let {startDate, endDate, page} = req.body.input ? req.body.input : req.body;
    startDate += " 00:00:00" ;
    endDate += " 23:59:59";
    const offset = 0;
    console.log('groupSaleReportRouter Download :', startDate, endDate, offset);

    try{
        const { totalGroupSaleReports } = await getGroupSaleReport(startDate, endDate, offset);
        const dataReport = totalGroupSaleReports;

        console.log('groupSaleReportRouter Download dataReport:',dataReport);
        res.status(200).json({ error: 0, message: JSON.stringify(dataReport)});
    }catch (e) {
        console.error('groupSaleReportRouter Download error:', e.message);
        res.status(500).json({ error: 1, message: e.message});
    }
});
module.exports = groupSaleReportRouter;