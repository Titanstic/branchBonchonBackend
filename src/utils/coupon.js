const getCouponQuery = (userCouponId , currentDate) => {
    const query = `
        query MyQuery($userCouponId: Int!, $couponEndDate: date!) {
              user_coupons(where: {id: {_eq: $userCouponId}, coupon: {end_date: {_gte: $couponEndDate}}, coupon_state: {_eq: active}}) {
                    coupon {
                          coupon_name
                          end_date
                          start_date
                          point
                    }
                    coupon_id
                    coupon_state
                    id
                    user {
                        name
                    }
                    user_id
              }
        }
    `;

    const variables = { userCouponId , couponEndDate: currentDate };

    return { query, variables };
};

const updateStatusForUserCouponById = (userCouponId, couponState) => {
    const couponUpdateQuery = `
        mutation MyMutation($userCouponId: Int!, $couponState: coupon_states_enum!) {
              update_user_coupons(where: {id: {_eq: $userCouponId}}, _set: {coupon_state: $couponState}) {
                    affected_rows
              }
        }
    `;

    const couponUpdateVariables = { userCouponId, couponState };
    return { couponUpdateQuery, couponUpdateVariables };
}

module.exports = { getCouponQuery, updateStatusForUserCouponById };