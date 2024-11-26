
const checkOperationForTransfer =  (tableName, operation, data) => {
    let query = "";
    let variables = {};

    switch (operation){
        case "create":
            query = `
                    mutation InsertData($input: ${tableName}_insert_input!) {
                        insert_${tableName}_one(object: $input) {
                            id
                        }
                    }
                `;
            variables= { input: { ...data } };
            break;
        case "update":
            const primaryKey = 'id';
            query = `
                    mutation UpdateData($pk: uuid!, $changes: ${tableName}_set_input!) {
                        update_${tableName}_by_pk(pk_columns: { ${primaryKey}: $pk }, _set: $changes) {
                            id
                        }
                    }
                `;
            variables = { pk: data[primaryKey], changes: { ...data } };
            break;
        case "delete":
            // Mutation to delete data in local Hasura
            const primaryKey2 = 'id'; // replace with the actual primary key of your table
            query = `
                    mutation DeleteData($pk: uuid!) {
                        delete_${tableName}_by_pk(${primaryKey2}: $pk) {
                            id
                        }
                    }
                `;
            variables = { pk: data[primaryKey2] };
            break;
    }

    return { query, variables }
};

const branchDataForTransfer = (id) => {
    let query = `
        query MyQuery($id: uuid!) {
              branches(where: {id: {_neq: $id}}) {
                    id
                    branch_name
              }
        }
    `;
    let variables = { id: id };

    return { query, variables };
}

module.exports = { checkOperationForTransfer, branchDataForTransfer };