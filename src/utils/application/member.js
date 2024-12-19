const getMemberQuery = (userCollaborationId , currentDate) => {
    const query = `
       query MyQuery($userCollaborationId: Int!, $currentDate: timestamptz!) {
              user_organizations(where: {id: {_eq: $userCollaborationId}, collaboration_member: {end_date: {_gte: $currentDate}}}) {
                    collaboration_member {
                          member_type
                          member_type_discount
                          organization
                    }
                        organization_id
              }
        }
    `;

    const variables = { userCollaborationId , currentDate };

    return { query, variables };
};

module.exports = { getMemberQuery };