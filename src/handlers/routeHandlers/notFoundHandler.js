/**
 * Title: 404 not found handler
 * Description:
 * Author: M.h Sajjad Hossain Ripon
 * Author's Github: https://github.com/mhsajjadhossain
 * Data: Fri,2022-06-03
 * Time: 16:22:30.000-05:00
 */
// handler object - module scaffolding.
const handler = {};

handler.notFoundHandler = (requestProperties, _callback) => {
    _callback(404, {
        message: '404 not found',
    });
};
// exporting module
module.exports = handler;
