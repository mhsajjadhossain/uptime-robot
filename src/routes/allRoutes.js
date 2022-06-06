/**
 * Title: All routes
 * Description: All routes will be listed here.
 * Author: M.h Sajjad Hossain Ripon
 * Author's Github: https://github.com/mhsajjadhossain
 * Data: Fri,2022-06-03
 * Time: 16:09:19.000-05:00
 */
// Dependencies
const { sampleHandler } = require("../handlers/routeHandlers/sampleHandler");
const { tokenHandler } = require("../handlers/routeHandlers/tokenHandler");
const { userHandler } = require("../handlers/routeHandlers/userHandler");

// routes object - module scaffolding.
const routes = {
  sample: sampleHandler,
  user: userHandler,
  tokens: tokenHandler,
};
// exporting module
module.exports = routes;
