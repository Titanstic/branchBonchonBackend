const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");
const fs = require("fs");

let customLastByItemLineH, customLastLineH, customQrLineH;

const cashierPrintSlipBuffer = async(employee_name, branchData, table_name, transitionId, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, branch_id, dinner_table_id, add_on, inclusive, point, payment_type_name, data, orderNo) => {
    console.log("cashierPrintUi [cashierPrintSlipBuffer]:", data);
    let flavourTypeDataLength = 0;
    let containerDataLength = 0;
    let discountDataLength = 0;
    data.forEach(each => {
        if (each.flavour_types) {
            flavourTypeDataLength += 1;
        }
        if (each.combo_menu_items) {
            const comboMenuItems = typeof each.combo_menu_items == "string" ? JSON.parse(each.combo_menu_items) : each.combo_menu_items;
            comboMenuItems.forEach((eachCombo) => {
                if (eachCombo.flavour_types) {
                    flavourTypeDataLength += 1;
                }
            })
        }
        if (each.container_charges > 0) {
            containerDataLength += 1;
        }

        if (each.discount_price > 0) {
            discountDataLength += 1;
        }
    })
    let flavourTypeLength = flavourTypeDataLength;
    const originalHeight = point ? 1100 : 900;
    let canvasHeight = originalHeight + data.length * 50 + flavourTypeLength * 30 + containerDataLength * 25 + discountDataLength * 25;
    const canvas = createCanvas(576, canvasHeight);
    const ctx = canvas.getContext("2d");

    const { lineHeight, nameH, addH, phoneH, titleLineH, invoiceH, dateTimeH, tableCashierH, informationLineH, headerHeight, firstLineH } = slipHeightData(data, point);

    // cashier ui design
    await headerUi(ctx, canvas, branchData, nameH, addH, phoneH, titleLineH, lineHeight);

    const currentDate = new Date();
    const date = currentDate.toLocaleDateString(),
        time = currentDate.toLocaleTimeString();
    informationUi(ctx, canvas, employee_name, table_name, dateTimeH, tableCashierH, informationLineH, date, time);

    buyItemUi(ctx, canvas, data, headerHeight, firstLineH, transitionId, invoiceH, orderNo);
    paymentDetailUi(ctx, canvas, sub_total_amount, tax_amount, discount_amount, grand_total_amount, payment_type_name, payment, cash_back, point, add_on, inclusive, service_charge_amount);

    if (point > 0) {
        await qrUi(transitionId, point, ctx, canvas, grand_total_amount);
    }

    footerUi(ctx, canvas, point)

    const filename = "orderImages/receipt.png";
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filename, buffer);

    return buffer;
};

const slipHeightData = (data, point) => {
    const lineHeight = 0;
    const nameH = lineHeight + 100;
    const addH = nameH + 40;
    const phoneH = addH + 40;
    const titleLineH = phoneH + 40;

    const dateTimeH = titleLineH + 30;
    const tableCashierH = dateTimeH + 30;
    const informationLineH = tableCashierH + 30;

    const invoiceH = informationLineH + 50;
    const headerHeight = invoiceH + 50;
    const firstLineH = headerHeight + 30;

    return { lineHeight, nameH, addH, phoneH, titleLineH, invoiceH, dateTimeH, tableCashierH, informationLineH, headerHeight, firstLineH };
};

const headerUi = async(ctx, canvas, branchData, nameH, addH, phoneH, titleLineH, lineHeight) => {
    console.log("cashierPrintUi [headerUi]: print Header")
    ctx.font = "24px Pyidaungsu";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    const logoImg = await loadImage("./images/logo.png");
    const logoWidth = 200;
    const logoHeight = (logoWidth / logoImg.width) * logoImg.height;
    ctx.drawImage(
        logoImg,
        canvas.width / 2 - logoWidth / 2,
        lineHeight,
        logoWidth,
        logoHeight
    );

    // => header
    ctx.font = "28px Comic Sans Ms";
    ctx.fillText(`${branchData.address}`, canvas.width / 2, nameH);
    ctx.fillText(
        `${branchData.road_city}`,
        canvas.width / 2,
        addH
    );
    ctx.fillText(`Phone - ${branchData.phone} `, canvas.width / 2, phoneH);
    ctx.fillText(
        `-----------------------------------------------------------------------------------------------------------`,
        190,
        titleLineH
    );
};

const informationUi = (ctx, canvas, employee_name, table_name, dateTimeH, tableCashierH, informationLineH, date, time) => {
    console.log("cashierPrintUi [informationUi]: print informationUi")
    ctx.textAlign = "start";
    ctx.font = "20px Comic Sans Ms";
    ctx.fillText(`Date`, 20, dateTimeH);
    ctx.fillText(`:`, 100, dateTimeH);
    ctx.fillText(`${date}`, 130, dateTimeH);

    ctx.textAlign = "right";
    ctx.fillText(`Time`, canvas.width - 160, dateTimeH);
    ctx.fillText(`:`, canvas.width - 130, dateTimeH);
    ctx.fillText(`${time}`, canvas.width - 10, dateTimeH);

    ctx.textAlign = "start";
    ctx.fillText(`Cashier`, 20, tableCashierH);
    ctx.fillText(`:`, 100, tableCashierH);
    ctx.fillText(`${employee_name}`, 130, tableCashierH);

    ctx.textAlign = "right";
    ctx.fillText(`Table`, canvas.width - 155, tableCashierH);
    ctx.fillText(`:`, canvas.width - 130, tableCashierH);
    ctx.fillText(`${table_name ? table_name : "-"}`, canvas.width - 10, tableCashierH);

    ctx.textAlign = "start";
    ctx.font = "24px Comic Sans Ms";
    ctx.fillText(
        `-----------------------------------------------------------------------------------------------------------`,
        0,
        informationLineH
    );
}

const buyItemUi = (ctx, canvas, data, headerHeight, firstLineH, transitionId, invoiceH, orderNo) => {
    console.log("cashierPrintUi [buyItemUi]: print buyItemUi")
    ctx.font = "24px Pyidaungsu";
    ctx.textAlign = "center";
    ctx.font = "24px Pyidaungsu";
    ctx.fillText(`Check No : ${orderNo}`, canvas.width / 2, invoiceH);

    ctx.fillText("Item Name", 80, headerHeight);
    ctx.fillText("Qty", canvas.width - 150, headerHeight);
    ctx.fillText("Price", canvas.width - 40, headerHeight);
    ctx.textAlign = "start";
    ctx.fillText(
        `-----------------------------------------------------------------------------------------------------------`,
        0,
        firstLineH
    );

    let flavourYPos = firstLineH;
    ctx.font = "24px Comic Sans Ms";
    data.forEach((productItem, index) => {
        flavourYPos += 40;
        ctx.textAlign = "start";
        ctx.fillText(productItem.item_name, 30, flavourYPos);
        ctx.fillText(productItem.is_take_away ? "T" : "D", 350, flavourYPos);
        ctx.textAlign = "right";
        ctx.fillText(productItem.quantity.toLocaleString("en-US"), canvas.width - 150, flavourYPos);

        if (productItem.discount_price > 0) {
            ctx.fillText((productItem.total_amount - productItem.discount_price).toLocaleString("en-US"), canvas.width - 10, flavourYPos);

            flavourYPos += 30;
            ctx.font = "20px Comic Sans Ms";
            ctx.fillText(productItem.total_amount.toLocaleString("en-US"), canvas.width - 10, flavourYPos);

            // Get the width of the text
            let textWidth = ctx.measureText(productItem.total_amount.toLocaleString("en-US")).width;

            // Draw a line through the text (strikethrough)
            ctx.strokeStyle = "gray"; // Color of the strikethrough line
            ctx.lineWidth = 2; // Thickness of the line
            ctx.beginPath();
            ctx.moveTo(canvas.width - 10 - textWidth, flavourYPos - 7); // Start point of the line
            ctx.lineTo(canvas.width - 10, flavourYPos - 7); // End point of the line
            ctx.stroke();
        } else {
            ctx.fillText(productItem.total_amount.toLocaleString("en-US"), canvas.width - 10, flavourYPos);
        }

        // need change
        if (productItem.combo_menu_items) {
            const comboMenuItems = typeof productItem.combo_menu_items == "string" ? JSON.parse(productItem.combo_menu_items) : productItem.combo_menu_items;

            comboMenuItems.forEach((eachCombo) => {
                ctx.textAlign = "start";
                ctx.font = "20px Comic Sans Ms";
                flavourYPos += 25;
                ctx.fillText(`•`, 40, flavourYPos);
                ctx.fillText(eachCombo.item_name, 70, flavourYPos);
            })
        }

        if (productItem.flavour_types) {
            ctx.textAlign = "start";
            ctx.font = "20px Comic Sans Ms";
            flavourYPos += 25;
            ctx.fillText(`•`, 50, flavourYPos);
            ctx.fillText(productItem.flavour_types, 70, flavourYPos);
        }

        if (productItem.container_charges > 0) {
            flavourYPos += 30;
            ctx.font = "20px Comic Sans Ms";
            ctx.textAlign = "start";
            ctx.fillText(`•`, 50, flavourYPos);
            ctx.fillText("Container Charges", 70, flavourYPos);

            ctx.textAlign = "right";
            ctx.fillText(productItem.container_charges.toLocaleString("en-US"), canvas.width - 10, flavourYPos);
        }
    });
    ///product name

    //first dotted line
    ctx.font = "24px Pyidaungsu";
    customLastByItemLineH = flavourYPos + 30;
    ctx.textAlign = "start";
    ctx.fillText(
        `-----------------------------------------------------------------------------------------------------------`,
        0,
        customLastByItemLineH
    );
}

const paymentDetailUi = (ctx, canvas, sub_total_amount, tax_amount, discount_amount, grand_total_amount, payment_type_name, payment, cash_back, point, add_on, inclusive, service_charge_amount) => {
    console.log("cashierPrintUi [paymentDetailUi]: print paymentDetailUi")
        //subtotal
    ctx.textAlign = "start";
    ctx.fillText(`Sub Total`, 20, customLastByItemLineH + 30);
    ctx.textAlign = "right";
    ctx.fillText(sub_total_amount.toLocaleString("en-US"), canvas.width - 10, customLastByItemLineH + 30);

    ctx.textAlign = "start";
    ctx.fillText(`Tax (5%)`, 20, customLastByItemLineH + 60);
    ctx.textAlign = "right";
    ctx.fillText((tax_amount + add_on + inclusive + service_charge_amount).toLocaleString("en-US"), canvas.width - 10, customLastByItemLineH + 60);

    //discount
    ctx.textAlign = "start";
    ctx.fillText(`Discount`, 20, customLastByItemLineH + 90);
    ctx.textAlign = "right";
    ctx.fillText(`${discount_amount.toLocaleString("en-US")}`, canvas.width - 10, customLastByItemLineH + 90);

    //grandtotal
    ctx.textAlign = "start";
    ctx.fillText(
        `-----------------------------------------------------------------------------------------------------------`,
        0,
        customLastByItemLineH + 120
    );

    ctx.font = "30px Comic Sans Ms";
    ctx.textAlign = "start";
    ctx.fillText(`Amount`, 20, customLastByItemLineH + 150);
    ctx.textAlign = "right";
    ctx.fillText(`${grand_total_amount.toLocaleString("en-US")}`, canvas.width - 10, customLastByItemLineH + 150);

    //cashback
    ctx.font = "24px Comic Sans Ms";
    ctx.textAlign = "start";
    ctx.fillText(`${payment_type_name.toUpperCase()}`, 20, customLastByItemLineH + 180);
    ctx.textAlign = "right";
    ctx.fillText(`${payment.toLocaleString("en-US")}`, canvas.width - 10, customLastByItemLineH + 180);

    //discount
    ctx.textAlign = "start";
    ctx.fillText(`CHANGE`, 20, customLastByItemLineH + 210);
    ctx.textAlign = "right";
    ctx.fillText(`${cash_back.toLocaleString("en-US")}`, canvas.width - 10, customLastByItemLineH + 210);

    if (point) {
        ctx.textAlign = "start";
        ctx.fillText(`POINTS`, 20, customLastByItemLineH + 240);
        ctx.textAlign = "right";
        ctx.fillText(`${point.toLocaleString("en-US")}`, canvas.width - 10, customLastByItemLineH + 240);
    }
    customLastLineH = customLastByItemLineH + 260;
    ctx.textAlign = "start";
    ctx.fillText(
        `-----------------------------------------------------------------------------------------------------------`,
        0,
        customLastByItemLineH + 260
    );
}

const qrUi = async(transitionId, point, ctx, canvas, grand_total_amount) => {
    console.log("cashierPrintUi [qrUi]: print qr ui")
    ctx.font = "28px Pyidaungsu";
    ctx.textAlign = "center";
    ctx.fillText("Scan this QR Code to Collect Points.", canvas.width / 2, customLastLineH + 30);

    const data = { id: transitionId, point, amount: grand_total_amount };
    console.log(data);
    const qrCodeData = await QRCode.toDataURL(JSON.stringify(data));

    ctx.font = "24px Pyidaungsu";
    ctx.textAlign = "center";
    const qrImage = await loadImage(qrCodeData);
    const qrWidth = 300;
    const qrHeight = (qrWidth / qrImage.width) * qrImage.height;
    ctx.drawImage(
        qrImage,
        canvas.width / 2 - qrWidth / 2,
        customLastLineH + 60,
        qrWidth,
        qrHeight
    );

    customQrLineH = customLastLineH + qrHeight + 60;
}


const footerUi = (ctx, canvas, point) => {
    console.log("cashierPrintUi [footerUi]: print footerUi")
    const customThankH = point ? customQrLineH + 50 : customLastLineH + 50;
    //thank you
    ctx.textAlign = "center";
    ctx.fillText("Thank You for visiting Bonchon.....", canvas.width / 2, customThankH);
    ctx.fillText("See You  Again!!", canvas.width / 2, customThankH + 30);
}
module.exports = cashierPrintSlipBuffer;