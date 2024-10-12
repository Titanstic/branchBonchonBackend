const express = require("express");
const groupDetailReportRouter = express.Router();

const {getGroupDetailSaleReport} = require("./groupReportModel");

groupDetailReportRouter.post("/", async (req, res) => {
    let {startDate, endDate, page} = req.body.input ? req.body.input : req.body;
    startDate += " 00:00:00" ;
    endDate += " 23:59:59";
    const offset = (page - 1) * 10;
    console.log('groupDetailReportRouter :', startDate, endDate, offset);

    try{
        const { groupDetailSaleReports, totalGroupDetailSaleReports } = await getGroupDetailSaleReport(startDate, endDate, offset);
        const dataReport = [ { pages: Math.ceil(totalGroupDetailSaleReports.length/10)}, { groupDetailSaleReports }];
        console.log('groupDetailReportRouter dataReport:', dataReport);

        res.status(200).json({ error: 0, message: JSON.stringify(dataReport)});
    }catch (e) {
        console.error('groupDetailReportRouter error:', e.message);
        res.status(500).json({ error: 1, message: e.message});
    }
});

groupDetailReportRouter.post("/download", async (req, res) => {
    let {startDate, endDate, page} = req.body.input ? req.body.input : req.body;
    startDate += " 00:00:00" ;
    endDate += " 23:59:59";
    const offset = 0
    console.log('groupDetailReportRouter Download :', startDate, endDate, offset);

    try{
        const { totalGroupDetailSaleReports } = await getGroupDetailSaleReport(startDate, endDate, offset);
        const dataReport = totalGroupDetailSaleReports;
        console.log('groupDetailReportRouter Download dataReport:', dataReport);

        res.status(200).json({ error: 0, message: JSON.stringify(dataReport)});
    }catch (e) {
        console.error('groupDetailReportRouter Download error:', e.message);
        res.status(500).json({ error: 1, message: e.message});
    }
});


module.exports = groupDetailReportRouter;