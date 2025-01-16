const getRecipeItemsQuery = (date7DaysAgo, currentDate) => {
    console.log(date7DaysAgo, currentDate);

    const query = `
            query MyQuery($startDate: timestamptz!, $endDate: timestamptz!) {
                  recipe_items(where: {created_at: {_gt: $startDate}, _and: {created_at: {_lt: $endDate}}}) {
                        id
                        qty
                        recipe_id
                        stock_items_id
                        type
                        updated_at
                        created_at
                  }
            }
        `;
    const variables = { startDate: `${date7DaysAgo.toLocaleDateString("en-US")}T00:00:00`, endDate: currentDate.toLocaleDateString("en-US") + "T23:59:59" };
    return { query, variables };
};

module.exports = { getRecipeItemsQuery };