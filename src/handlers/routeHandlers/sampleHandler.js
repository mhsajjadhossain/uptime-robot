/**
 * Title: Sample handler
 * Description:
 * Author: M.h Sajjad Hossain Ripon
 * Author's Github: https://github.com/mhsajjadhossain
 * Data: Fri,2022-06-03
 * Time: 16:12:17.000-05:00
 */

// handle object - module scaffolding.
const handle = {};

handle.sampleHandler = (requestProperties, _callback) => {
    console.log(requestProperties);
    _callback(200, {
        message: 'This is sample handler',
    });
};

// exporting module
module.exports = handle;
