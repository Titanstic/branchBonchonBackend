const { Pool } = require("pg");

const {databaseHost,databaseName,databasePassword,databaseUsername} = require("../config")

const pool = new Pool({
    host : databaseHost,
    user : databaseUsername,
    database: databaseName,
    password: databasePassword,
    max : 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,

})

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
        process.exit(-1);
    }
    console.log("database connected");
    release();
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})


module.exports = pool;