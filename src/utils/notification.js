const {findEmployeeById} = require("../models/employeeModel");

const filterNotification = async (data, tableName, action) => {
    let title = "", description = "";

    switch (tableName) {
        case "cashier_drawer":
            if(action === "INSERT"){
                const employee = await findEmployeeById(data.opening_employee_id);

                title = "Add Cash";
                description = `${data.opening_cash} MMK was added cash in drawer by ${employee.username}.`;
            }else{
                const employee = await findEmployeeById(data.pick_employee_id);

                title = "Collect Cash";
                description = `${data.cash_in_drawer} MMK was collected from cash in drawer by ${employee.username}.`;
            }
            break;
        case "good_received":
            title = "Good Received";
            description = `Invoice No -${data.invoice_no} has ${data.status} state.`;
            break;
        case "good_return":
            title = "Good Return";
            description = `Ref No -${data.ref_no} has ${data.status} state.`;
            break;
        case "purchase_order":
            title = "Purchase Order";
            description = `Doc No -${data.doc_no} has ${data.status} state.`;
            break;
        case "transfer_in":
            title = "Transfer in";
            description = `Invoice No -${data.invoice_no} has ${data.status} state.`;
            break;
        case "transfer_out":
            title = "Transfer Out";
            description = `Ref No -${data.ref_no} has ${data.status} state.`;
            break;
        case "wastes":
            const wasteEmployee = await findEmployeeById(data.employee_id);

            title = "Wastes";
            description = `Code No -${data.code_id} has been wasted by ${wasteEmployee.username}.`;
            break;
    }

    console.log("utils [filterNotification] title: ", title)
    console.log("utils [filterNotification] description: ", description);
    return { title, description };
};

module.exports = { filterNotification }