const express = require("express");
const calculateStockRouter = express.Router();

const poolQuery = require("../misc/poolQuery.js");

calculateStockRouter.post("/", async (req, res) => {
    const event = req.body.event;
    const transitionId = event.data.new.id;

    try{
        const resMessage = await poolQuery(`SELECT * FROM public.stock_reduce($1);`, [transitionId]);

        res.status(200).json({ success: true, message: resMessage});
    }catch (e) {
        res.status(500).json({ success: true, message: e.message});
    }

});

module.exports = calculateStockRouter;



// const transitionId = "dc45856a-2b18-4269-8e78-67af67389afb";
// // => get transition table ကနေ transition item data ကို ယူ
// const transitionMenus = await poolQuery(`SELECT * FROM transaction_items WHERE transaction_id = $1;`, [transitionId]);
// console.log(transitionMenus.rows);
//
// // 2 ရလာတဲ့ transition recipe item data တွေကို loop ပတ်
// // 3 အဲ့ each recipe data တစ်ခှချင်းစီ က stock ကို loop ထပ်ပတ်
// // 4 အဲ့ each stock မှာ ရေးထားတဲ့ qty အတိုင်း stock table မှာ သွားနှုတ်
// //=> နှုတ်တဲ့ အချိန် first -> recipe unit က စကြည့်
//
// // equation
// // PU 1 box = 12 bottle IU
// // RU 1000 l = 1 bottle
//
// for (const eachMenu of transitionMenus.rows) {
//     // to get recipe data
//     let recipeItems;
//
//     // check normal menu or combo set
//     if(eachMenu.normal_menu_item_id){
//         recipeItems = await poolQuery(`SELECT * FROM menu_recipe_items WHERE menu_id = $1;`, [eachMenu.normal_menu_item_id]);
//     }else{
//         const menuItems = await poolQuery(`SELECT * FROM combo_menu_items WHERE combo_set_id = $1;`, [eachMenu.combo_set_id]);
//         for (const eachMenuItem of menuItems.rows) {
//             recipeItems = await poolQuery(`SELECT * FROM menu_recipe_items WHERE menu_id = $1;`, [eachMenuItem.normal_menu_item_id]);
//         }
//     }
//
//     // after get recipe item, to calculate find stock item id
//     for (const eachRecipeItem of recipeItems.rows) {
//         const stockItems = await poolQuery(`SELECT * FROM recipe_items WHERE recipe_id = $1;`, [eachRecipeItem.recipe_id]);
//
//         for(const eachStockItem of stockItems.rows){
//             // eachStockItem.stock_items_id
//             // start calculation
//             // -> first recipe unit
//         }
//
//     }
// }