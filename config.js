const databaseHost = process.env.DATABASE_SERVER_ADDRESS || "localhost";
const databaseName = process.env.DATABASE_NAME || "postgres";
const databasePassword = process.env.DATABASE_PASSWORD || "postgrespassword";
const databaseUsername = process.env.DATABASE_USERNAME  || "postgres";

const port = process.env.PORT || 3002;
const posPort = process.env.POS_PORT || 4000;
const dashboardPort = process.env.DASHBOARD_PORT || 5000;

const jwttokenkey = "Cast from ten bronze cannons, it was unveiled on April 19, 1875, during the centennial celebration of the Battle of Concord";
const jwtExpTime = "3d";

module.exports = { databaseHost, databaseName, databaseUsername, databasePassword, port, posPort, dashboardPort, jwttokenkey, jwtExpTime };