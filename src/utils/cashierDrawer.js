const calculateDrawerAmount = (cashierDrawerData, grand_total_amount, payment_type_name, sub_total_amount, add_on, tax_amount, rounding, parsedItems, type, customer_count, promotion, discount) => {
    if(payment_type_name === "Cash"){
        cashierDrawerData.cash_sale += grand_total_amount;
        cashierDrawerData.cash_in_drawer += grand_total_amount;
    }else{
        cashierDrawerData.other_sale += grand_total_amount;
    }
    cashierDrawerData.total_revenue += grand_total_amount;
    cashierDrawerData.total_revenue_count += 1;

    cashierDrawerData.total_amount += sub_total_amount;
    cashierDrawerData.discount += discount;
    cashierDrawerData.promotion += promotion;
    cashierDrawerData.net_sales += grand_total_amount;
    cashierDrawerData.tax_add_on += (add_on + tax_amount);
    cashierDrawerData.rounding = `${Number(cashierDrawerData.rounding) + Number(rounding)}`;

    cashierDrawerData.guest_count += customer_count;

    parsedItems.forEach((eachItem) => {
        if(eachItem.is_take_away && type === "self"){
            cashierDrawerData.die_in += eachItem.total_amount;
        }else if(!eachItem.is_take_away && type === "self"){
            cashierDrawerData.self_take_away += eachItem.total_amount;
        }else{
            cashierDrawerData.delivery += eachItem.total_amount;
        }
    })

    const setCashierDrawerData = `SET 
        cash_sale = ${cashierDrawerData.cash_sale}, 
        other_sale = ${cashierDrawerData.other_sale}, 
        total_revenue = ${cashierDrawerData.total_revenue}, 
        cash_in_drawer = ${cashierDrawerData.cash_in_drawer},
        total_amount = ${cashierDrawerData.total_amount},
        discount = ${cashierDrawerData.discount},
        promotion = ${cashierDrawerData.promotion},
        net_sales = ${cashierDrawerData.net_sales},
        tax_add_on = ${cashierDrawerData.tax_add_on},
        rounding = ${cashierDrawerData.rounding},
        die_in = ${cashierDrawerData.die_in},
        self_take_away = ${cashierDrawerData.self_take_away},
        delivery = ${cashierDrawerData.delivery},
        guest_count = ${cashierDrawerData.guest_count},
        total_revenue_count = ${cashierDrawerData.total_revenue_count}
    `;

    console.log("utils [calculateDrawerAmount]: " , setCashierDrawerData)
    return { setCashierDrawerData };
};

const rowBackDrawerAmount = (cashierDrawerData, transactionData, parsedItems, paymentTypeData) => {
    if(paymentTypeData.payment_name === "Cash"){
        cashierDrawerData.cash_sale -= transactionData.grand_total_amount;
        cashierDrawerData.cash_in_drawer -= transactionData.grand_total_amount;
    }else{
        cashierDrawerData.other_sale -= transactionData.grand_total_amount;
    }
    cashierDrawerData.total_revenue -= transactionData.grand_total_amount;
    cashierDrawerData.total_revenue_count -= 1;

    cashierDrawerData.total_amount -= transactionData.sub_total_amount;
    cashierDrawerData.discount -= transactionData.discount_amount;
    cashierDrawerData.promotion -= transactionData.promotion_amount;
    cashierDrawerData.net_sales -= transactionData.grand_total_amount;
    cashierDrawerData.tax_add_on -= transactionData.add_on + transactionData.tax_amount;
    cashierDrawerData.rounding = `${Number(cashierDrawerData.rounding) - Number(transactionData.rounding)}`;

    cashierDrawerData.void += transactionData.grand_total_amount;
    cashierDrawerData.void_count += 1;

    cashierDrawerData.guest_count -= transactionData.customer_count;

    parsedItems.forEach((eachItem) => {
        if(eachItem.is_take_away && paymentTypeData.type === "self"){
            cashierDrawerData.die_in -= eachItem.total_amount;
        }else if(!eachItem.is_take_away && paymentTypeData.type === "self"){
            cashierDrawerData.self_take_away -= eachItem.total_amount;
        }else{
            cashierDrawerData.delivery -= eachItem.total_amount;
        }
    })

    const setCashierDrawerData = `SET 
        cash_sale = ${cashierDrawerData.cash_sale}, 
        other_sale = ${cashierDrawerData.other_sale}, 
        total_revenue = ${cashierDrawerData.total_revenue}, 
        cash_in_drawer = ${cashierDrawerData.cash_in_drawer},
        total_amount = ${cashierDrawerData.total_amount},
        discount = ${cashierDrawerData.discount},
        promotion = ${cashierDrawerData.promotion},
        net_sales = ${cashierDrawerData.net_sales},
        tax_add_on = ${cashierDrawerData.tax_add_on},
        rounding = ${cashierDrawerData.rounding},
        die_in = ${cashierDrawerData.die_in},
        self_take_away = ${cashierDrawerData.self_take_away},
        delivery = ${cashierDrawerData.delivery},
        guest_count = ${cashierDrawerData.guest_count},
        total_revenue_count = ${cashierDrawerData.total_revenue_count},
        void = ${cashierDrawerData.void}
    `;

    console.log("utils [calculateDrawerAmount]: " , setCashierDrawerData)
    return { setCashierDrawerData };
};
module.exports = { calculateDrawerAmount, rowBackDrawerAmount };

