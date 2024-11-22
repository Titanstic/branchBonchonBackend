const { createCanvas, loadImage } = require("@napi-rs/canvas");
const fs = require("fs");

const cashierDrawerPrintSlipBuffer = async (cashierDrawer, cashierDrawerDetail, branchName) => {
    const date = new Date();
    const currentDate = date.toLocaleDateString("en-US");
    const currentTime = date.toLocaleTimeString("en-US");

    const { canvas, ctx, startLineHeight } = slipHeight(cashierDrawerDetail);
    const { finishHeaderLineHeight } = headerUi(canvas, ctx, branchName, cashierDrawer, currentDate, currentTime, startLineHeight);
    const { finishBodyLineHeight } = bodyUi(canvas, ctx, cashierDrawer, finishHeaderLineHeight);
    cashierDrawerDetailUi(canvas, ctx, cashierDrawerDetail, finishBodyLineHeight);

    const filename = fs.existsSync("./resources/app/orderImages/cashierDrawer.png") ? "./resources/app/orderImages/cashierDrawer.png" : "./orderImages/cashierDrawer.png";
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filename, buffer);
    return buffer;
};

const slipHeight = (cashierDrawerDetail) => {
    const cashierDrawerDetailHeight = cashierDrawerDetail.length * 30;
    const originalHeight = 900;
    const canvasHeight = originalHeight + cashierDrawerDetailHeight;

    const canvas = createCanvas(576, canvasHeight);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    const startLineHeight = 0;

    return { canvas, ctx, startLineHeight }
};

const headerUi = (canvas, ctx, branchName, cashierDrawer, currentDate, currentTime, startLineHeight) => {
    const titleLineHeight = startLineHeight + 30;
    const branchLineHeight = titleLineHeight + 40;
    const dateLineHeight = branchLineHeight + 30;
    const employeeLineHeight = dateLineHeight + 30;
    const printedOnLineHeight = employeeLineHeight + 30;
    const printEmployeeLineHeight = printedOnLineHeight + 30;
    const guestLineHeight = printEmployeeLineHeight + 30;
    const finishHeaderLineHeight = guestLineHeight + 20;

    ctx.font = "28px Myanmar Text";
    ctx.textAlign = "center";
    ctx.fillText(`System Sale Report`, canvas.width/2, titleLineHeight);

    ctx.font = "22px Myanmar Text";
    ctx.textAlign = "start";
    ctx.fillText(`Branch`, 30, branchLineHeight);
    ctx.fillText(`:`, canvas.width/2, branchLineHeight);
    ctx.fillText(`${branchName}`, canvas.width/2 + 30, branchLineHeight);

    ctx.fillText(`Date`, 30, dateLineHeight);
    ctx.fillText(`:`, canvas.width/2, dateLineHeight);
    ctx.fillText(`${currentDate}`, canvas.width/2 + 30, dateLineHeight);

    ctx.fillText(`Employee`, 30, employeeLineHeight);
    ctx.fillText(`:`, canvas.width/2, employeeLineHeight);
    ctx.fillText(`${cashierDrawer.openemployeename}`, canvas.width/2 + 30, employeeLineHeight);

    ctx.fillText(`Printed On`, 30, printedOnLineHeight);
    ctx.fillText(`:`, canvas.width/2, printedOnLineHeight);
    ctx.fillText(`${currentDate} ${currentTime}`, canvas.width/2 + 30, printedOnLineHeight);

    ctx.fillText(`Printed By`, 30, printEmployeeLineHeight);
    ctx.fillText(`:`, canvas.width/2, printEmployeeLineHeight);
    ctx.fillText(`${cashierDrawer.pickemployeename}`, canvas.width/2 + 30, printEmployeeLineHeight);

    ctx.fillText(`Guess Count`, 30, guestLineHeight);
    ctx.fillText(`:`, canvas.width/2, guestLineHeight);
    ctx.fillText(`${cashierDrawer.guest_count}`, canvas.width/2 + 30, guestLineHeight);

    ctx.fillText(
        `-----------------------------------------------------------------------------------------------------------`,
        0,
        finishHeaderLineHeight
    );

    console.log("cashierDrawerPrintUi [headerUi]: print Header");
    return { finishHeaderLineHeight };
}

const bodyUi = (canvas, ctx, cashierDrawer, finishHeaderLineHeight) => {
    const totalAmountLineHeight = finishHeaderLineHeight + 20;
    const discountLineHeight = totalAmountLineHeight + 30;
    const promotionLineHeight = discountLineHeight + 30;
    const netSaleLineHeight = promotionLineHeight + 30;
    const taxAddOnLineHeight = netSaleLineHeight + 30;
    const roundingLineHeight = taxAddOnLineHeight + 30;
    const totalRevenueLineHeight = roundingLineHeight + 30;
    const firstLineHeight = totalRevenueLineHeight + 20;

    ctx.textAlign = "start";
    ctx.fillText(`Total Sales`, 30, totalAmountLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.total_amount).toLocaleString("en-US")}`, canvas.width - 30, totalAmountLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(`Discount`, 30, discountLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.discount).toLocaleString("en-US")}`, canvas.width - 30, discountLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(`Promotions`, 30, promotionLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.promotion).toLocaleString("en-US")}`, canvas.width - 30, promotionLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(`Net Sale`, 30, netSaleLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.net_sales).toLocaleString("en-US")}`, canvas.width - 30, netSaleLineHeight);


    ctx.textAlign = "start";
    ctx.fillText(`Net Sale`, 30, netSaleLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.net_sales).toLocaleString("en-US")}`, canvas.width - 30, netSaleLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(`Tax Add On`, 30, taxAddOnLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.tax_add_on).toLocaleString("en-US")}`, canvas.width - 30, taxAddOnLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(`Rounding`, 30, roundingLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.rounding).toLocaleString("en-US")}`, canvas.width - 30, roundingLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(`Total Revenue`, 30, totalRevenueLineHeight);
    ctx.fillText(`${Number(cashierDrawer.total_revenue_count).toLocaleString("en-US")}`, canvas.width/2, totalRevenueLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.total_revenue).toLocaleString("en-US")}`, canvas.width - 30, totalRevenueLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(
        `-----------------------------------------------------------------------------------------------------------`,
        0,
        firstLineHeight
    );

    const voidsLineHeight = firstLineHeight + 30;
    const secondLineHeight = voidsLineHeight + 30;

    ctx.textAlign = "start";
    ctx.fillText(`Voids`, 30, voidsLineHeight);
    ctx.fillText(`${Number(cashierDrawer.void_count).toLocaleString("en-US")}`, canvas.width/2, voidsLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.void).toLocaleString("en-US")}`, canvas.width - 30, voidsLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(
        `-----------------------------------------------------------------------------------------------------------`,
        0,
        secondLineHeight
    );

    const openingCashLineHeight = secondLineHeight + 20;
    const cashSaleLineHeight = openingCashLineHeight + 30;
    const pickUpLineHeight = cashSaleLineHeight + 30;
    const cashInDrawerLineHeight = pickUpLineHeight + 30;
    const thirdLineHeight = cashInDrawerLineHeight + 20;

    ctx.textAlign = "start";
    ctx.fillText(`Opening Cash`, 30, openingCashLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.opening_cash).toLocaleString("en-US")}`, canvas.width - 30, openingCashLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(`Cash Sales`, 30, cashSaleLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.cash_sale).toLocaleString("en-US")}`, canvas.width - 30, cashSaleLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(`Pick Up`, 30, pickUpLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.pick_up).toLocaleString("en-US")}`, canvas.width - 30, pickUpLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(`Cash in Drawer`, 30, cashInDrawerLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.cash_in_drawer).toLocaleString("en-US")}`, canvas.width - 30, cashInDrawerLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(
        `-----------------------------------------------------------------------------------------------------------`,
        0,
        thirdLineHeight
    );

    const dieInLineHeight = thirdLineHeight + 20;
    const takeawayLineHeight = dieInLineHeight + 30;
    const deliveryLineHeight = takeawayLineHeight + 30;
    const finishBodyLineHeight = deliveryLineHeight + 20;

    ctx.textAlign = "start";
    ctx.fillText(`Dine In`, 30, dieInLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.die_in).toLocaleString("en-US")}`, canvas.width - 30, dieInLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(`Take Away`, 30, takeawayLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.self_take_away).toLocaleString("en-US")}`, canvas.width - 30, takeawayLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(`Deliveries`, 30, deliveryLineHeight);
    ctx.textAlign = "right";
    ctx.fillText(`${Number(cashierDrawer.delivery).toLocaleString("en-US")}`, canvas.width - 30, deliveryLineHeight);

    ctx.textAlign = "start";
    ctx.fillText(
        `-----------------------------------------------------------------------------------------------------------`,
        0,
        finishBodyLineHeight
    );

    console.log("cashierDrawerPrintUi [bodyUi]: print Body");
    return { finishBodyLineHeight };
}

const cashierDrawerDetailUi = (canvas, ctx, cashierDrawerDetail, finishBodyLineHeight) => {
    let eachDetailLineHeight = finishBodyLineHeight + 20;

    cashierDrawerDetail.forEach(eachDetail => {
        ctx.textAlign = "start";
        ctx.fillText(`${eachDetail.payment_type}`, 30, eachDetailLineHeight);
        ctx.textAlign = "right";
        ctx.fillText(`${Number(eachDetail.sale_amount).toLocaleString("en-US")}`, canvas.width - 30, eachDetailLineHeight);

        eachDetailLineHeight += 30;
    })

    console.log("cashierDrawerPrintUi [cashierDrawerDetailUi]: print cashierDrawerDetail");
}

module.exports = cashierDrawerPrintSlipBuffer;