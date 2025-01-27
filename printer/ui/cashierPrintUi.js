const { createCanvas, loadImage } = require("@napi-rs/canvas");
const QRCode = require("qrcode");
const fs = require("fs");
const {encryptWithAES} = require("../../src/utils/qr");

const cashierPrintSlipBuffer = async (employee_name, branchData, table_name, transitionId, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, branch_id, dinner_table_id, add_on, inclusive, point, payment_type_name, data, orderNo, promotion, slipType, appAmount, transitionVoid) => {
  const currentDate = new Date();
  const date = currentDate.toLocaleDateString(),
      time = currentDate.toLocaleTimeString();

  let { canvas, ctx, startLineHeight, footerStartLineHeight } = slipHeight(data, point);

  const { finishHeaderLineH } = await  headerUi(ctx, canvas, branchData, startLineHeight);
  const { finishInfoLineH } = informationUi(ctx, canvas, employee_name, table_name, date, time, orderNo, slipType, finishHeaderLineH);
  const { finishBuyItemLineH } = buyItemUi(ctx, canvas, data, finishInfoLineH);
  const { finishPaymentInfoLineHeight } = paymentInformationUi(ctx, canvas, finishBuyItemLineH, sub_total_amount, discount_amount, promotion, tax_amount, grand_total_amount, payment_type_name, payment, cash_back, point, appAmount);

  footerStartLineHeight = finishPaymentInfoLineHeight;
  if (point > 0) {
    const { qrTextLineH } = await qrUi(transitionId, point, ctx, canvas, grand_total_amount, finishPaymentInfoLineHeight, currentDate);
    footerStartLineHeight = qrTextLineH;
  }
  footerUi(ctx, canvas, footerStartLineHeight);

  const filename = fs.existsSync("./resources/app/orderImages/receipt.png") ? "./resources/app/orderImages/receipt.png" : "./orderImages/receipt.png";
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(filename, buffer);

  return buffer;
};

const slipHeight = (data, point) => {
  let flavourTypeDataLength = 0;
  let containerDataLength = 0;
  let discountDataLength = 0;

  data.forEach((each) => {
    if (each.flavour_types) {
      flavourTypeDataLength += 1;
    }

    if (each.combo_menu_items) {
      const comboMenuItems = typeof each.combo_menu_items == "string" ? JSON.parse(each.combo_menu_items) : each.combo_menu_items;
      comboMenuItems.forEach((eachCombo) => {
        if (eachCombo.flavour_types) {
          flavourTypeDataLength += 1;
        }
      });
    }

    if (each.container_charges > 0) {
      containerDataLength += 1;
    }

    if (each.discount_price > 0) {
      discountDataLength += 1;
    }
  });

  const originalHeight = point > 0 ? 1200 : 900;
  let canvasHeight = originalHeight + data.length * 50 + flavourTypeDataLength * 30 + containerDataLength * 25 + discountDataLength * 25;
  const canvas = createCanvas(576, canvasHeight);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";

  const startLineHeight = 0;
  const footerStartLineHeight = 0;

  return { canvas, ctx, startLineHeight, footerStartLineHeight }
};

const headerUi = async (ctx, canvas, branchData, startLineHeight) => {
  const lineHeight = startLineHeight + 100;
  const nameH = lineHeight + 90;
  const addH = nameH + 30;
  const phoneH = addH + 30;
  const finishHeaderLineH = phoneH + 30;

  const logoFilePath = fs.existsSync("./resources/app/images/logo.png") ? "./resources/app/images/logo.png" : "./images/logo.png";
  const logoImg = await loadImage(logoFilePath);
  const logoWidth = 200;
  const logoHeight = (logoWidth / logoImg.width) * logoImg.height;
  ctx.font = "24px Myanmar Text";
  ctx.textAlign = "center";
  ctx.drawImage(logoImg, canvas.width / 2 - logoWidth / 2, lineHeight, logoWidth, logoHeight);

  // => header
  ctx.font = "28px Myanmar Text";
  ctx.fillText(`${branchData.address}`, canvas.width / 2, nameH);
  ctx.fillText(`${branchData.road_city}`, canvas.width / 2, addH);
  ctx.fillText(`Phone - ${branchData.phone} `, canvas.width / 2, phoneH);

  ctx.textAlign = "start";
  ctx.fillText(`-----------------------------------------------------------------------------------------------------------`, 0, finishHeaderLineH);

  console.log("cashierPrintUi [headerUi]: print Header");
  return { finishHeaderLineH }
};

const informationUi = (ctx, canvas, employee_name, table_name, date, time, orderNo, slipType, finishHeaderLineH) => {
  const dateTimeH = finishHeaderLineH + 30;
  const tableCashierH = dateTimeH + 30;
  const slipTypeH = tableCashierH + 30;
  const invoiceH = slipTypeH + 30;
  const finishInfoLineH = invoiceH + 30;

  console.log("cashierPrintUi [informationUi]: print informationUi");
  ctx.font = "20px Myanmar Text";
  ctx.textAlign = "start";
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
  ctx.fillText(`${table_name ?? "-"}`, canvas.width - 10, tableCashierH);

  ctx.textAlign = "start";
  ctx.fillText(`Slip Type`, 20, slipTypeH);
  ctx.fillText(`:`, 100, slipTypeH);
  ctx.fillText(`${slipType}`, 130, slipTypeH);

  ctx.font = "24px Myanmar Text";
  ctx.textAlign = "center";
  ctx.fillText(`Check No : ${orderNo}`, canvas.width / 2, invoiceH);

  ctx.textAlign = "start";
  ctx.font = "24px Myanmar Text";
  ctx.fillText(`-----------------------------------------------------------------------------------------------------------`, 0, finishInfoLineH);

  console.log("cashierPrintUi [Information Ui]: print Information Ui");
  return { finishInfoLineH };
};

const buyItemUi = (ctx, canvas, data, finishInfoLineH) => {
  const headerHeight = finishInfoLineH + 30;
  const firstLineH = headerHeight + 30;
  let finishBuyItemLineH = 0;

  ctx.fillText("Item Name", 50, headerHeight);
  ctx.fillText("Qty", canvas.width - 150, headerHeight);
  ctx.fillText("Price", canvas.width - 60, headerHeight);
  ctx.textAlign = "start";
  ctx.fillText(`-----------------------------------------------------------------------------------------------------------`, 0, firstLineH);

  let flavourYPos = firstLineH;
  data.forEach((productItem, index) => {
    flavourYPos += 40;
    ctx.font = "24px Myanmar Text";
    ctx.textAlign = "start";
    ctx.fillText(productItem.item_name, 30, flavourYPos);
    ctx.fillText(productItem.is_take_away ? "T" : "D", 350, flavourYPos);

    ctx.textAlign = "right";
    ctx.fillText(productItem.quantity.toLocaleString("en-US"), canvas.width - 150, flavourYPos);
    ctx.fillText((productItem.price * productItem.quantity).toLocaleString("en-US"), canvas.width - 10, flavourYPos);

    // need change
    if (productItem.combo_menu_items) {
      const comboMenuItems = typeof productItem.combo_menu_items == "string" ? JSON.parse(productItem.combo_menu_items) : productItem.combo_menu_items;
      comboMenuItems.forEach((eachCombo) => {
        ctx.textAlign = "start";
        ctx.font = "20px Myanmar Text";
        flavourYPos += 25;
        ctx.fillText(`•`, 40, flavourYPos);
        ctx.fillText(eachCombo.item_name, 70, flavourYPos);
      });
    }

    if (productItem.flavour_types) {
      ctx.textAlign = "start";
      ctx.font = "20px Myanmar Text";
      flavourYPos += 25;
      ctx.fillText(`•`, 50, flavourYPos);
      ctx.fillText(productItem.flavour_types, 70, flavourYPos);
    }

    if (productItem.container_charges && productItem.container_charges > 0) {
      flavourYPos += 30;
      ctx.font = "20px Myanmar Text";
      ctx.textAlign = "start";
      ctx.fillText(`•`, 50, flavourYPos);
      ctx.fillText("Container Charges", 70, flavourYPos);

      ctx.textAlign = "right";
      ctx.fillText(productItem.container_charges.toLocaleString("en-US"), canvas.width - 10, flavourYPos);
    }
  });
  ///product name

  //first dotted line
  finishBuyItemLineH = flavourYPos + 30;
  ctx.font = "24px Myanmar Text";
  ctx.textAlign = "start";
  ctx.fillText(`-----------------------------------------------------------------------------------------------------------`, 0, finishBuyItemLineH);

  console.log("cashierPrintUi [buyItemUi]: print buyItemUi");
  return { finishBuyItemLineH };
};

const paymentInformationUi = (ctx, canvas, finishBuyItemLineH, sub_total_amount, discount_amount, promotion, tax_amount, grand_total_amount, payment_type_name, payment, cash_back, point, appAmount) => {
  const subTotalHeight = finishBuyItemLineH + 20;
  const discountHeight = subTotalHeight + 30;
  const appDisHeight = discountHeight + 30;
  const taxHeight = appDisHeight + 30;
  const firstLineHeight = taxHeight + 20;

  ctx.font = "24px Myanmar Text";
  ctx.textAlign = "start";
  ctx.fillText("Sub Total", 30, subTotalHeight);
  ctx.textAlign = "right";
  ctx.fillText(Number(sub_total_amount).toLocaleString("en-US"), canvas.width - 10, subTotalHeight);

  ctx.textAlign = "start";
  ctx.fillText("Discount", 30, discountHeight);
  ctx.textAlign = "right";
  ctx.fillText(`-${(Number(discount_amount) + Number(promotion)).toLocaleString("en-US")}`, canvas.width - 10, discountHeight);

  ctx.textAlign = "start";
  ctx.fillText("App Dis", 30, appDisHeight);
  ctx.textAlign = "right";
  ctx.fillText(Number(appAmount ? -appAmount : -0).toLocaleString("en-US"), canvas.width - 10, appDisHeight);

  ctx.textAlign = "start";
  ctx.fillText("Tax ( 5% )", 30, taxHeight);
  ctx.textAlign = "right";
  ctx.fillText(Number(tax_amount).toLocaleString("en-US"), canvas.width - 10, taxHeight);

  ctx.textAlign = "start";
  ctx.fillText(`-----------------------------------------------------------------------------------------------------------`, 0, firstLineHeight);

  const amountHeight = firstLineHeight + 20;
  const paymentTypeHeight = amountHeight + 30;
  const changeHeight = paymentTypeHeight + 30;
  const changeLineHeight = changeHeight + 30;
  const pointHeight = changeLineHeight + 30;
  const finishPaymentInfoLineHeight = point > 0 ?  pointHeight + 20 : changeLineHeight + 20;

  ctx.font = "28px Myanmar Text";
  ctx.textAlign = "start";
  ctx.fillText("Amount", 30, amountHeight);
  ctx.textAlign = "right";
  ctx.fillText(Number(grand_total_amount).toLocaleString("en-US"), canvas.width - 10, amountHeight);

  ctx.textAlign = "start";
  ctx.fillText(`${payment_type_name}`, 30, paymentTypeHeight);
  ctx.textAlign = "right";
  ctx.fillText(Number(payment).toLocaleString("en-US"), canvas.width - 10, paymentTypeHeight);

  ctx.textAlign = "start";
  ctx.fillText("Change", 30, changeHeight);
  ctx.textAlign = "right";
  ctx.fillText(Number(cash_back).toLocaleString("en-US"), canvas.width - 10, changeHeight);

  ctx.textAlign = "start";
  ctx.fillText(`-----------------------------------------------------------------------------------------------------------`, 0, changeLineHeight);

  if(point > 0){
    ctx.textAlign = "start";
    ctx.fillText("Point", 30, pointHeight);
    ctx.textAlign = "right";
    ctx.fillText(Number(point).toLocaleString("en-US"), canvas.width - 10, pointHeight);

    ctx.textAlign = "start";
    ctx.fillText(`-----------------------------------------------------------------------------------------------------------`, 0, finishPaymentInfoLineHeight);

    return { finishPaymentInfoLineHeight };
  }

  return { changeLineHeight };
}

const qrUi = async (transitionId, point, ctx, canvas, grand_total_amount, finishBuyItemLineH, currentDate) => {
  const qrLineH = finishBuyItemLineH + 10;

  // const formattedDate = `${currentDate.getFullYear()}/${(currentDate.getMonth() + 1)
  //     .toString()
  //     .padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;

  const formattedDate = currentDate.toLocaleString('en-US', { timeZone: 'Asia/Yangon' });

  const data = { id: transitionId, point, amount: grand_total_amount, used_at: formattedDate };
  const encryptData = encryptWithAES(JSON.stringify(data));
  const qrCodeData = await QRCode.toDataURL(JSON.stringify(encryptData));

  ctx.font = "24px Myanmar Text";
  ctx.textAlign = "center";
  const qrImage = await loadImage(qrCodeData);
  const qrWidth = 280;
  const qrHeight = (qrWidth / qrImage.width) * qrImage.height;
  ctx.drawImage(qrImage, canvas.width / 2 - qrWidth / 2, qrLineH, qrWidth, qrHeight);

  const qrTextLineH = qrLineH + qrHeight + 30;
  ctx.fillText("Scan this QR Code to Collect Points.", canvas.width / 2, qrTextLineH);

  console.log("cashierPrintUi [qrUi]: print qr ui");
  return { qrTextLineH };
};

const footerUi = (ctx, canvas, footerStartLineHeight) => {
  const thanYouH = footerStartLineHeight + 30;
  const seeYouH = thanYouH + 30;

  ctx.textAlign = "center";
  ctx.fillText("Thank You for visiting Bonchon.....", canvas.width / 2, thanYouH);
  ctx.fillText("See You  Again!!", canvas.width / 2, seeYouH);

  console.log("cashierPrintUi [footerUi]: print footerUi");
};

module.exports = cashierPrintSlipBuffer;
