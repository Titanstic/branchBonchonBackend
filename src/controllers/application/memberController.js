const express = require("express");
const {executeBonchonApp} = require("../../utils/mutation");
const {getMemberQuery} = require("../../utils/application/member");
const memberController = express.Router();

memberController.post("/getData", async (req, res) => {
    const { userCollaborationId } = req.body.input ?? req.body;

    const currentDate = new Date().toLocaleDateString();
    const {query, variables } = getMemberQuery(userCollaborationId, currentDate);

    try {
        const { user_organizations } = await executeBonchonApp(query, variables);
        if(user_organizations.length === 0){
            throw new Error("Organization not found or expired!");
        }

        const memberData = {
            memberId: user_organizations[0].organization_id,
            organization: user_organizations[0].collaboration_member.organization,
            member_type: user_organizations[0].collaboration_member.member_type,
            member_type_discount: user_organizations[0].collaboration_member.member_type_discount
        }

        console.log(`memberController [getData]: Member Data get successfully`);
        res.status(200).send({ error: 0, message: "Member Data get successfully", memberData });
    } catch (e) {
        console.error(`couponController [getData] error: `, e.message);
        res.status(200).send({error: 1, message: e.message});
    }
});

module.exports = memberController;