const databaseHost = process.env.DATABASE_SERVER_ADDRESS;
const databaseName = process.env.DATABASE_NAME;
const databasePassword = process.env.DATABASE_PASSWORD;
const databaseUsername = process.env.DATABASE_USERNAME;

const jwttokenkey = "Cast from ten bronze cannons, it was unveiled on April 19, 1875, during the centennial celebration of the Battle of Concord";
const jwtExpTime = "3d";

module.exports = { databaseHost, databaseName, databaseUsername, databasePassword, jwttokenkey, jwtExpTime };