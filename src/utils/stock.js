const checkOperation =  async (event, tableName) => {
    let query = "";
    let variables = {};
    let input;

    const operation = event.op;
    if(operation !== "DELETE"){
        input = event.data.new;
    }

    switch (operation){
        case "INSERT":
            query = `
                    mutation InsertData($input: ${tableName}_insert_input!) {
                        insert_${tableName}_one(object: $input) {
                            id
                        }
                    }
                `;
            variables= { input };
            break;
        case "UPDATE":
            const primaryKey = 'id';
            query = `
                    mutation UpdateData($pk: uuid!, $changes: ${tableName}_set_input!) {
                        update_${tableName}_by_pk(pk_columns: { ${primaryKey}: $pk }, _set: $changes) {
                            id
                        }
                    }
                `;
            variables = { pk: event.data.old[primaryKey], changes: event.data.new };
            break;
        case "DELETE":
            // Mutation to delete data in local Hasura
            const primaryKey2 = 'id'; // replace with the actual primary key of your table
            query = `
                    mutation DeleteData($pk: uuid!) {
                        delete_${tableName}_by_pk(${primaryKey2}: $pk) {
                            id
                        }
                    }
                `;
            variables = { pk: event.data.old[primaryKey2] };
            break;
    }

    return { query, variables }
};

module.exports = { checkOperation };