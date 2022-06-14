/**
 * Title: environment variables
 * Description: all environment variables
 * Author: M.h Sajjad Hossain Ripon
 * Author's Github: https://github.com/mhsajjadhossain
 * Data: Fri,2022-06-03
 * Time: 20:27:53.000-05:00
 */
// env object - module scaffolding.
const env = {};

// staging environments
env.staging = {
  port: 5000,
  envName: "staging",
  secret: "c0fa1bc00531bd78ef38c628449c5102",
  maxChecks: 5,
};
// production environment
env.production = {
  port: 3000,
  envName: "production",
  secret: "c0fa1bc00531bd78ef38c628449c5102",
  maxChecks: 5,
};
// determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding enviroment object
const enviromentToExport =
  typeof env[currentEnvironment] === "object"
    ? env[currentEnvironment]
    : env.staging;

// exporting module
module.exports = enviromentToExport;
