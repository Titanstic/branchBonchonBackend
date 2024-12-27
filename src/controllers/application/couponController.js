const express = require("express");
const {getCouponQuery, updateStatusForUserCouponById} = require("../../utils/application/coupon");
const {executeBonchonApp} = require("../../utils/mutation");
const couponController = express.Router();

couponController.post("/getData", async (req, res) => {
    const { userCouponId } = req.body.input ?? req.body;

    const currentDate = new Date().toLocaleDateString();
    const {query, variables } = getCouponQuery(userCouponId, currentDate);
    console.log(`couponController [getData] query: `, query);
    console.log(`couponController [getData] variables: `, variables);

    try {
        const { user_coupons } = await executeBonchonApp(query, variables);
        if(user_coupons.length === 0){
            throw new Error("User Coupon not found or expired or used!");
        }else{
            console.log(`couponController [getData] : `, user_coupons[0]);
            const {couponUpdateQuery, couponUpdateVariables} = updateStatusForUserCouponById(user_coupons[0].id, "used");
            await executeBonchonApp(couponUpdateQuery, couponUpdateVariables);
        }

        const couponData = {
            couponId: user_coupons[0].coupon_id,
            couponName: user_coupons[0].coupon.coupon_name,
            amount: (user_coupons[0].coupon.point * 100),
            userCouponId: user_coupons[0].id
        }

        console.log(`couponController [getData]: Coupon Data get successfully`);
        res.status(200).send({ error: 0, message: "Coupon Data get successfully", couponData });
    } catch (e) {
        console.error(`couponController [getData] error: `, e.message);
        res.status(200).send({error: 1, message: e.message});
    }
});


couponController.post("/updateStatus", async (req, res) => {
    const { userCouponId } = req.body.input ?? req.body;

    try {
        const {couponUpdateQuery, couponUpdateVariables} = updateStatusForUserCouponById(userCouponId, "active");
        await executeBonchonApp(couponUpdateQuery, couponUpdateVariables);

        console.log(`couponController [updateStatus]: Coupon Data delete successfully`);
        res.status(200).send({ error: 0, message: "Coupon Data delete successfully"});
    } catch (e) {
        console.error(`couponController [getData] error: `, e.message);
        res.status(200).send({error: 1, message: e.message});
    }
});

module.exports = couponController;
