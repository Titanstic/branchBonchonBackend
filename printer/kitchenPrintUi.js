const {createCanvas} = require("@napi-rs/canvas");
const fs = require("fs");

const kitchenPrintSlipBuffer = async (data, table_name, transitionId, orderNo) => {
    const dieInItems = [],
        takeAwayItems = [];

    let flavourTypeLength = 0;

    data.forEach(each => {
        flavourTypeLength += each.flavour_types.length;
        if(each.is_take_away){
            takeAwayItems.push(each);
        }else{
            dieInItems.push(each);
        }
    })

    let canvasHeight = 250 + data.length * 40 + flavourTypeLength * 30;
    // console.log("-------------------------total height", canvasHeight);
    const canvas = createCanvas(576, canvasHeight);
    const ctx = canvas.getContext("2d");

    const { checkNoH, checkLineH, dieInItemH, dieInLineH, takeAwayItemH, takeAwayLineH, dateTimeH, tableNoH} = slipHeightData(dieInItems, takeAwayItems, flavourTypeLength);

    ctx.fillStyle = "black";
    ctx.font = "24px Pyidaungsu";
    checkNoUi(ctx, canvas, transitionId, checkNoH, checkLineH, orderNo );
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString(),
        time = currentDate.toLocaleTimeString();

    buyItemUi(ctx, canvas, checkLineH, dieInItemH, dieInLineH, takeAwayItemH, dieInItems, takeAwayLineH, takeAwayItems, date, time, data[0].printer_name, table_name);

    const fileName = "orderImages/kitchen.png";
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(fileName, buffer);

    return buffer;
};

const slipHeightData = (dieInItems, takeAwayItems, orderNo) => {
    const checkNoH = 40;
    const checkLineH = checkNoH + 30;

    // Calculate dieInItemH considering flavor types
    let dieInItemH = dieInItems.length > 0 ? (checkLineH + 30) : checkLineH;
    let dieInLineH = dieInItems.length > 0 ? (dieInItemH + 30) : dieInItemH;

    let takeAwayItemH = takeAwayItems.length > 0 ? (dieInLineH + 30) : dieInLineH;
    let takeAwayLineH = takeAwayItems.length > 0 ? (takeAwayItemH + 30) : takeAwayItemH;

    const dateTimeH = takeAwayLineH + 30;
    const tableNoH = dateTimeH + 40;

    return { checkNoH, checkLineH, dieInItemH, dieInLineH, takeAwayItemH, takeAwayLineH, dateTimeH, tableNoH };
};

const checkNoUi = (ctx, canvas,transitionId, checkNoH, checkLineH, orderNo) => {
    ctx.textAlign = "start";
    ctx.fillText(`Check No : ${orderNo}`, 0, checkNoH);
    ctx.fillText(
        `-----------------------------------------------------------------------------------------------------------`,
        0,
        checkLineH
    );
};

const buyItemUi = (ctx, canvas, checkLineH, dieInItemH, dieInLineH, takeAwayItemH, dieInItems, takeAwayLineH, takeAwayItems, date, time, printerName, table_name ) => {
    ctx.font = "30px Pyidaungsu";
    let flavourYPos = checkLineH;
    dieInItems.forEach((productItem, index) => {
        ctx.font = "24px Pyidaungsu";
        flavourYPos += 30;
        ctx.textAlign = "start";
        ctx.fillText(productItem.item_name, 30, flavourYPos);
        ctx.textAlign = "right";
        ctx.fillText(productItem.quantity.toLocaleString("en-US"), canvas.width - 80, flavourYPos);

        ctx.textAlign = "start";
        productItem?.flavour_types.forEach((flavour, flavourIndex) => {
            if(flavour.name !== ""){
                ctx.font = "18px Pyidaungsu";
                flavourYPos += (flavourIndex + 1) * 25;

                // Draw bullet point
                ctx.fillText(`•`, 50, flavourYPos);

                // Draw flavour text next to bullet point
                ctx.fillText(flavour.name, 70, flavourYPos);
            }
        })
    });

    let customDieInItemH = dieInItemH + 30,
    customDieInLineH = customDieInItemH + 30;
    if(dieInItems.length > 0){
        customDieInItemH = flavourYPos + 40;
        customDieInLineH = customDieInItemH + 20;

        ctx.font = "24px Pyidaungsu";
        ctx.textAlign = "center";
        ctx.fillText("***** ( Dine In ) ******", canvas.width / 2 , customDieInItemH);
        ctx.textAlign = "start";
        ctx.fillText(
            `-----------------------------------------------------------------------------------------------------------`,
            0,
            customDieInLineH
        );
    }


    let takeFlavourYPos = dieInItems.length > 0 ? customDieInLineH : checkLineH;
    takeAwayItems.forEach((productItem, index) => {
        takeFlavourYPos += 50;

        ctx.font = "24px Pyidaungsu";
        ctx.textAlign = "start";
        ctx.fillText(productItem.item_name, 30, takeFlavourYPos);
        ctx.textAlign = "right";
        ctx.fillText(productItem.quantity.toLocaleString("en-US"), canvas.width - 80, takeFlavourYPos);

        ctx.textAlign = "start";
        productItem?.flavour_types.forEach((flavour, flavourIndex) => {
            if(flavour.name !== ""){
                ctx.font = "18px Pyidaungsu";
                takeFlavourYPos += (flavourIndex + 1) * 25;

                // Draw bullet point
                ctx.fillText(`•`, 50, takeFlavourYPos);

                // Draw flavour text next to bullet point
                ctx.fillText(flavour.name, 70, takeFlavourYPos);
            }
        })
    });


    if(takeAwayItems.length > 0){
        ctx.font = "24px Pyidaungsu";
        ctx.textAlign = "center";
        ctx.fillText("***** ( Take Away ) ******", canvas.width / 2 , takeFlavourYPos +40)
        ctx.textAlign = "start";
        ctx.fillText(
            `-----------------------------------------------------------------------------------------------------------`,
            0,
            takeFlavourYPos + 60
        );
    }

    ctx.font = "24px Pyidaungsu";
    ctx.textAlign = "start";
    ctx.fillText(date, 10, takeAwayItems.length > 0 ? takeFlavourYPos + 90 : customDieInItemH + 60 );
    ctx.textAlign = "right";
    ctx.fillText(time, canvas.width - 30, takeAwayItems.length > 0 ? takeFlavourYPos + 90 : customDieInItemH + 60);


    ctx.textAlign = "start";
    ctx.fillText(`Printer : ${printerName}`, 10, takeAwayItems.length > 0 ? takeFlavourYPos + 120 : customDieInItemH + 90);
    ctx.textAlign = "right";
    ctx.fillText(`Table : ${table_name ? table_name : "-"}`, canvas.width - 30, takeAwayItems.length > 0 ? takeFlavourYPos + 120 : customDieInItemH + 90);
}

module.exports = kitchenPrintSlipBuffer;
