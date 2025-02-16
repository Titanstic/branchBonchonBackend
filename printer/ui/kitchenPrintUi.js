const {createCanvas} = require("@napi-rs/canvas");
const fs = require("fs");

const kitchenPrintSlipBuffer = async (data, table_name, transitionId, orderNo, slipType) => {
    const dieInItems = [],
        takeAwayItems = [];

    let flavourTypeLength = 0;
    let noteTypeLength = 0;

    data.forEach(each => {
        if(each.is_take_away){
            takeAwayItems.push(each);
        }else{
            dieInItems.push(each);
        }

        if(each.flavour_types){
            flavourTypeLength += 49;
        }

        if(each.note){
            const noteItems = typeof each.note == "string" ? JSON.parse(each.note) : each.note;
            noteTypeLength += (noteItems.length * 30) + 19;
        }

        if(each.combo_menu_items){
            const comboMenuItems = typeof each.combo_menu_items == "string" ? JSON.parse(each.combo_menu_items) : each.combo_menu_items;
            comboMenuItems.forEach((eachCombo) => {
                if(eachCombo.flavour_types){
                    flavourTypeLength += 50;
                }

                if(eachCombo.note){
                    const noteItems = typeof eachCombo.note == "string" ? JSON.parse(eachCombo.note) : eachCombo.note;
                    noteTypeLength += (noteItems.length * 30) + 20;
                }
            })
        }
    })
    console.log(data.length, flavourTypeLength, noteTypeLength);
    let canvasHeight = 300 + data.length * 30 + flavourTypeLength + noteTypeLength;
    // let canvasHeight = 300;
    console.log("------- kitchen canvasHeight", canvasHeight);
    const canvas = createCanvas(576, canvasHeight);
    const ctx = canvas.getContext("2d");

    const { checkNoH, checkLineH, dieInItemH, dieInLineH, takeAwayItemH, takeAwayLineH} = slipHeightData(dieInItems, takeAwayItems, flavourTypeLength);

    ctx.fillStyle = "black";
    ctx.font = "24px Myanmar Text";
    checkNoUi(ctx, canvas, transitionId, checkNoH, checkLineH, orderNo, slipType );
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString(),
        time = currentDate.toLocaleTimeString();

    buyItemUi(ctx, canvas, checkLineH, dieInItemH, dieInLineH, takeAwayItemH, dieInItems, takeAwayLineH, takeAwayItems, date, time, data[0].kitchen_printer, table_name);

    const filename = fs.existsSync("./resources/app/orderImages/kitchen.png") ? "./resources/app/orderImages/kitchen.png" : "./orderImages/kitchen.png";
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filename, buffer);

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

    return { checkNoH, checkLineH, dieInItemH, dieInLineH, takeAwayItemH, takeAwayLineH };
};

const checkNoUi = (ctx, canvas,transitionId, checkNoH, checkLineH, orderNo, slipType) => {
    ctx.textAlign = "start";
    ctx.fillText(`Check No : ${orderNo}`, 0, checkNoH);

    ctx.textAlign = "right";
    ctx.fillText(`${slipType}`, canvas.width - 10, checkNoH)

    ctx.textAlign = "start";
    ctx.fillText(
        `-----------------------------------------------------------------------------------------------------------`,
        0,
        checkLineH
    );

};

const buyItemUi = (ctx, canvas, checkLineH, dieInItemH, dieInLineH, takeAwayItemH, dieInItems, takeAwayLineH, takeAwayItems, date, time, printerName, table_name ) => {
    ctx.font = "30px Myanmar Text";

    // =>  start Die In Item
    let flavourYPos = checkLineH;
    dieInItems.forEach((productItem, index) => {
        ctx.font = "24px Myanmar Text";
        flavourYPos += 40;
        ctx.textAlign = "start";
        ctx.fillText(productItem.item_name, 30, flavourYPos);
        if(productItem.comboName){
            ctx.textAlign = "right";
            ctx.fillText(`(${productItem.comboName})`, canvas.width - 100, flavourYPos);
        }
        ctx.textAlign = "right";
        ctx.fillText(productItem.quantity.toLocaleString("en-US"), canvas.width - 60, flavourYPos);

        ctx.textAlign = "start";
        ctx.font = "18px Myanmar Text";
        if(productItem.flavour_types.length > 0) {
            flavourYPos += 25;
            // Draw bullet point
            ctx.fillText(`Flavour Type`, 40, flavourYPos);

            flavourYPos += 25;
            // Draw bullet point
            ctx.fillText(`•`, 50, flavourYPos);

            // Draw flavour text next to bullet point
            ctx.fillText(productItem.flavour_types, 70, flavourYPos);
        }

        ctx.textAlign = "start";
        ctx.font = "18px Myanmar Text";
        const productNote = typeof productItem.note == "string" ? JSON.parse(productItem.note) : productItem.note;
        if(productNote.length > 0) {
            flavourYPos += 25;
            // Draw bullet point
            ctx.fillText(`Note`, 40, flavourYPos);

            productNote.forEach((note) => {
                flavourYPos += 25;
                // Draw bullet point
                ctx.fillText(`•`, 50, flavourYPos);

                // Draw flavour text next to bullet point
                ctx.fillText(note, 70, flavourYPos);
            })
        }
    });

    let customDieInItemH = dieInItemH + 30,
    customDieInLineH = customDieInItemH + 30;
    // let customDieInItemH = flavourYPos + 30,
    // customDieInLineH = flavourYPos + 30;
    if(dieInItems.length > 0){
        customDieInItemH = flavourYPos + 30;
        customDieInLineH = customDieInItemH + 30;

        ctx.font = "24px Myanmar Text";
        ctx.textAlign = "center";
        ctx.fillText("***** ( Dine In ) ******", canvas.width / 2 , customDieInItemH);
        ctx.textAlign = "start";
        ctx.fillText(
            `-----------------------------------------------------------------------------------------------------------`,
            0,
            customDieInLineH
        );
        console.log("customDieInLineH", customDieInLineH);
    }
    // => End Die In Item

    // =>  start Take Away Item
    let takeFlavourYPos = dieInItems.length > 0 ? customDieInLineH : checkLineH;
    // let takeFlavourYPos = customDieInLineH;
    takeAwayItems.forEach((productItem, index) => {
        takeFlavourYPos += 40;

        ctx.font = "24px Myanmar Text";
        ctx.textAlign = "start";
        ctx.fillText(productItem.item_name, 30, takeFlavourYPos);
        ctx.textAlign = "right";
        ctx.fillText(productItem.quantity.toLocaleString("en-US"), canvas.width - 80, takeFlavourYPos);

        ctx.textAlign = "start";
        ctx.font = "18px Myanmar Text";
        if(productItem.flavour_types.length > 0) {
            takeFlavourYPos += 25;
            // Draw bullet point
            ctx.fillText(`Flavour Type`, 40, takeFlavourYPos);

            takeFlavourYPos += 25;
            // Draw bullet point
            ctx.fillText(`•`, 50, takeFlavourYPos);

            // Draw flavour text next to bullet point
            ctx.fillText(productItem.flavour_types, 70, takeFlavourYPos);
        }

        ctx.textAlign = "start";
        ctx.font = "18px Myanmar Text";
        const productNote = JSON.parse(productItem.note);
        if(productNote.length > 0) {
            takeFlavourYPos += 25;
            // Draw bullet point
            ctx.fillText(`Note`, 40, takeFlavourYPos);

            productNote.forEach((note) => {
                takeFlavourYPos += 25;
                // Draw bullet point
                ctx.fillText(`•`, 50, takeFlavourYPos);

                // Draw flavour text next to bullet point
                ctx.fillText(note, 70, takeFlavourYPos);
            })
        }

    });

    if(takeAwayItems.length > 0){
        takeFlavourYPos += 30;
        ctx.font = "24px Myanmar Text";
        ctx.textAlign = "center";
        ctx.fillText("***** ( Take Away ) ******", canvas.width / 2 , takeFlavourYPos);

        takeFlavourYPos += 30;
        ctx.textAlign = "start";
        ctx.fillText(
            `-----------------------------------------------------------------------------------------------------------`,
            0,
            takeFlavourYPos
        );
    }
    // =>  End Take Away Item

    ctx.font = "24px Myanmar Text";
    ctx.textAlign = "start";
    ctx.fillText(date, 10, takeAwayItems.length > 0 ? takeFlavourYPos + 30 : customDieInLineH + 30 );
    console.log("------- kitchen date", takeAwayItems.length > 0 ? takeFlavourYPos + 30 : customDieInLineH + 30);
    ctx.textAlign = "right";
    ctx.fillText(time, canvas.width - 30, takeAwayItems.length > 0 ? takeFlavourYPos + 30 : customDieInLineH + 30);

    ctx.textAlign = "start";
    ctx.fillText(`Printer : ${printerName}`, 10, takeAwayItems.length > 0 ? takeFlavourYPos + 60 : customDieInLineH + 60);
    console.log("------- kitchen date", takeAwayItems.length > 0 ? takeFlavourYPos + 60 : customDieInLineH + 60);
    ctx.textAlign = "right";
    ctx.fillText(`Table : ${table_name ? table_name : "-"}`, canvas.width - 30, takeAwayItems.length > 0 ? takeFlavourYPos + 60 : customDieInLineH + 60);
}

module.exports = kitchenPrintSlipBuffer;
