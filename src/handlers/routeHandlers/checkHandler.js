/**
 * Title: user handler
 * Description:
 * Author: M.h Sajjad Hossain Ripon
 * Author's Github: https://github.com/mhsajjadhossain
 * Data: Fri,2022-06-03
 * Time: 16:12:17.000-05:00
 */
// dependencies
const env = require("../../config/env");
const {
  hash,
  parseJSON,
  generateRandomString,
} = require("../../helpers/utilities");
const {
  isValidToken,
  isValidMethod,
  isValidUrl,
  isValidStatusCode,
  isValidTimeOut,
  isValidProtocol,
} = require("../../helpers/validation");
const data = require("../../lib/data");
const { _tokens } = require("./tokenHandler");
// handle object - module scaffolding.
const handle = {};

handle.checkHandler = (requestProperties, callback) => {
  // all allowed methods
  const allowedMethods = ["get", "post", "put", "delete"];
  const { method } = requestProperties;
  if (allowedMethods.indexOf(method) > -1) {
    handle._checks[method](requestProperties, callback);
  } else {
    callback(405);
  }
};

// _checks object - containing all users methods and properties
handle._checks = {};
/**
 * @title : Get checks controller
 * @method get
 * @query : baseurl.com/users?phone=01912033222
 * @Auth : true
 */
handle._checks.get = (requestProperties, callback) => {
  // validating inputs
  const token = isValidToken(requestProperties.headers.id);
  console.log("token :", token);
  const id = isValidToken(requestProperties.query.id);
  // console.log("id :", id);

  if (id) {
    // if id is available and valid the lookup for the check doc
    data.read("checks", id, (checkReadErr, checkData) => {
      if (!checkReadErr) {
        const checkObject = parseJSON(checkData);
        console.log("checkObject :", checkObject);
        // verify the user
        _tokens.verify(token, checkObject.usersPhone, (isVerified) => {
          console.log("isValidToken :", isVerified);
          if (isVerified) {
            callback(200, checkObject);
          } else {
            callback(401, { err: "UnAuthorized" });
          }
        });
      } else {
        callback(400, { err: "you have a problem in your request" });
      }
    });
  } else {
    callback(400, { err: "you have a problem in your request" });
  }
};
/**
 * @title : Create Checks Controller
 * @method post
 * @sample_request_body : {
 *  "firstName": "M.h Sajjad Hossain",
 *  "lastName": "Ripon",
 *  "phone": "01913055200",
 *  "password": "secret12",
 *  "tncAgreement": true
 * }
 *
 */
handle._checks.post = (requestProperties, callback) => {
  // data validation
  const token = isValidToken(requestProperties.headers.id);
  const method = isValidMethod(requestProperties.body.method);
  const protocol = isValidProtocol(requestProperties.body.protocol);
  const url = isValidUrl(requestProperties.body.url);
  const statusCodes = isValidStatusCode(requestProperties.body.statusCodes);
  const maxTimeOut = isValidTimeOut(requestProperties.body.maxTimeOut);
  if (method || url || statusCodes || maxTimeOut) {
    // look for the token data
    data.read("tokens", token, (err, tokenObj) => {
      if (!err && tokenObj) {
        const usersPhone = parseJSON(tokenObj).phone;
        // lookup for the user
        data.read("users", usersPhone, (userErr, user) => {
          if (!userErr && user) {
            _tokens.verify(token, usersPhone, (isVerified) => {
              if (isVerified) {
                let userObj = parseJSON(user);
                let usersChecks =
                  typeof userObj.checks === "object" &&
                  userObj.checks instanceof Array
                    ? userObj.checks
                    : [];
                if (usersChecks.length < env.maxChecks) {
                  const checkId = generateRandomString(20);
                  let checkObject = {
                    id: checkId,
                    usersPhone,
                    protocol,
                    method,
                    url,
                    statusCodes,
                    maxTimeOut,
                  };
                  // creating new check
                  data.create("checks", checkId, checkObject, (checkErr) => {
                    if (!checkErr) {
                      userObj.checks = usersChecks;
                      userObj.checks.push(checkId);
                      data.update("users", usersPhone, userObj, (userUErr) => {
                        if (!userUErr) {
                          callback("200", checkObject);
                        } else {
                          callback("500", {
                            err: "There have some issue in server side!",
                          });
                        }
                      });
                    } else {
                      callback("500", {
                        err: "There have some issue in server side!",
                      });
                    }
                  });
                } else {
                  callback("400", {
                    err: "User has already reached max checks limit!",
                  });
                }
              } else {
                callback("401", {
                  err: "unAuthorized!",
                });
              }
            });
          } else {
            callback("401", {
              err: "unAuthorized!",
            });
          }
        });
      } else {
        callback("403", {
          err: "unAuthorized!",
        });
      }
    });

    // _tokens.verify(token, "01913055208", (isVerified) => {
    //   console.log("isVerified :", isVerified);
    //   if (isVerified) {
    //     callback(200, {
    //       error: "Authorized!",
    //     });
    //     // reading token doc and get usersPhone from this
    //     // data.
    //   } else {
    //     callback(401, {
    //       error: "UnAuthorized!",
    //     });
    //   }
    // });
  } else {
    callback(400, {
      error: "There have a problem in your request!",
    });
  }
};
/**
 * @title : Update User Controller
 * @method put
 * @Auth : true
 * @sample_request_body : {
 *  "firstName": "M.h Sajjad Hossain",
 *  "lastName": "Ripon",
 *  "phone": "01913055200",
 *  "password": "secret12"
 * }
 */
handle._checks.put = (requestProperties, callback) => {};

/**
 * @title : delete user controller
 * @method delete
 * @Auth : true
 * @query : baseurl.com/users?phone=01912033222
 */
handle._checks.delete = (requestProperties, callback) => {};

// exporting module
module.exports = handle;
