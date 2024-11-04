const cashierPrintSlipBuffer = require("./ui/cashierPrintUi");
const {networkPrinterPrint} = require("./networkPrinterPrint");
const kitchenPrintSlipBuffer = require("./ui/kitchenPrintUi");
const cashierDrawerPrintSlipBuffer = require("./ui/cashierDrawerPrintUi");

const PrintSlip = async (employee_name, employee_printer, branchData, table_name, id, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, branch_id, dinner_table_id, add_on, inclusive, point, payment_type_name, orderNo, parsedItems, kitchenPrintItem) => {
    //  printer state
    const cashierSlipBuffer = await cashierPrintSlipBuffer(employee_name, branchData, table_name, id, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, branch_id, dinner_table_id, add_on, inclusive, point, payment_type_name, parsedItems, orderNo);
    networkPrinterPrint(cashierSlipBuffer, employee_printer);

    for (const each of kitchenPrintItem) {
        const kitchenSlipBuffer = await kitchenPrintSlipBuffer(each, table_name, id, orderNo);
        networkPrinterPrint(kitchenSlipBuffer, each[0].kitchen_printer);
    }
};

const PrintCashierDrawer = async (cashierDrawer, cashierDrawerDetail, branchName) => {
    const cashierDrawerSlipBuffer = await cashierDrawerPrintSlipBuffer(cashierDrawer, cashierDrawerDetail, branchName);
    networkPrinterPrint(cashierDrawerSlipBuffer, cashierDrawer.printer_name);
}

module.exports = { PrintSlip, PrintCashierDrawer }

