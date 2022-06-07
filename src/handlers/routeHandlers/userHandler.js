/**
 * Title: user handler
 * Description:
 * Author: M.h Sajjad Hossain Ripon
 * Author's Github: https://github.com/mhsajjadhossain
 * Data: Fri,2022-06-03
 * Time: 16:12:17.000-05:00
 */
// dependencies
const { hash, parseJSON } = require("../../helpers/utilities");
const data = require("../../lib/data");
const { _tokens } = require("./tokenHandler");
// handle object - module scaffolding.
const handle = {};

handle.userHandler = (requestProperties, callback) => {
  // all allowed methods
  const allowedMethods = ["get", "post", "put", "delete"];
  const { method } = requestProperties;
  if (allowedMethods.indexOf(method) > -1) {
    handle._users[method](requestProperties, callback);
  } else {
    callback(405);
  }
};

// _users object - containing all users methods and properties
handle._users = {};
/**
 * @title : Get user controller
 * @method get
 * @query : baseurl.com/users?phone=01912033222
 * @Auth : true
 */
handle._users.get = (requestProperties, callback) => {
  const { query } = requestProperties;
  const phone =
    typeof query?.phone === "string" && query?.phone.trim().length === 11
      ? query?.phone
      : false;
  const token =
    typeof requestProperties.headers.token === "string" &&
    requestProperties.headers.token.trim().length === 20
      ? requestProperties.headers.token
      : false;

  if (phone) {
    _tokens.verify(token, phone, (isVerified) => {
      if (isVerified) {
        data.read("users", phone, (err, user) => {
          const userToSend = { ...parseJSON(user) };
          if (!err && user) {
            delete userToSend.password;
            callback(200, userToSend);
          } else {
            callback(404, {
              error: "User can't found!",
            });
          }
        });
      } else {
        callback(401, {
          error: "unauthorized request",
        });
      }
    });
  } else {
    callback(404, {
      error: "User can't found!",
    });
  }
};
/**
 * @title : Create User Controller
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
handle._users.post = (requestProperties, callback) => {
  //   validating firstName
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  // validating lastName
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  // validating phone
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  // validating password
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length >= 8
      ? requestProperties.body.password
      : false;
  //   validating tncAgriment
  const tncAgreement =
    typeof requestProperties.body.tncAgreement === "boolean"
      ? requestProperties.body.tncAgreement
      : false;
  // check if all fields are available
  if (firstName && lastName && phone && password && tncAgreement) {
    // check user is already exist
    data.read("users", phone, (err, user) => {
      if (err) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tncAgreement,
        };
        data.create("users", phone, userObject, (err) => {
          if (!err) {
            callback({
              message: "User succesfully created!",
            });
          } else {
            callback(500, { error: "cannot create new user" });
          }
        });
      } else {
        callback(500, {
          error: "user already exists.",
        });
      }
    });
  } else {
    callback(400);
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
handle._users.put = (requestProperties, callback) => {
  // validating phone
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const token =
    typeof requestProperties.headers.token === "string" &&
    requestProperties.headers.token.trim().length === 20
      ? requestProperties.headers.token
      : false;
  //   validating firstName
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  // validating lastName
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  // validating password
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length >= 8
      ? requestProperties.body.password
      : false;
  // check if phone true
  if (phone) {
    // check if updated anything
    if (firstName || lastName || password) {
      // lookup if user exist
      _tokens.verify(token, phone, (isVerified) => {
        // verify user
        if (isVerified) {
          // lookup for users
          data.read("users", phone, (readErr, user) => {
            const userData = { ...parseJSON(user) };
            if (!readErr && user) {
              // update properties if exist
              if (firstName) userData.firstName = firstName;
              if (lastName) userData.lastName = lastName;
              if (password) userData.password = hash(password);

              // update the user to database
              data.update("users", phone, userData, (updateErr) => {
                if (!updateErr) {
                  callback(200, {
                    message: "User has been successfully updated!",
                  });
                } else {
                  callback(500, {
                    error: "There have a problem in server",
                  });
                }
              });
            } else {
              callback(400, {
                error: "Invalid User Input",
              });
            }
          });
        } else {
          callback(401, {
            error: "unauthorized request",
          });
        }
      });
    } else {
      callback(400, {
        error: "Invalid Request",
      });
    }
  } else {
    callback(400, {
      error: "There is a problem with input data.",
    });
  }
};

/**
 * @title : delete user controller
 * @method delete
 * @Auth : true
 * @query : baseurl.com/users?phone=01912033222
 */
handle._users.delete = (requestProperties, callback) => {
  const { query } = requestProperties;
  const phone =
    typeof query?.phone === "string" && query?.phone.trim().length === 11
      ? query?.phone
      : false;
  const token =
    typeof requestProperties.headers.token === "string" &&
    requestProperties.headers.token.trim().length === 20
      ? requestProperties.headers.token
      : false;
  if (phone) {
    // lookup if user exist
    _tokens.verify(token, phone, (isVerified) => {
      // verify user
      if (isVerified) {
        // lookup for the user if exist
        data.read("users", phone, (lookupErr, user) => {
          if (!lookupErr && user) {
            data.delete("users", phone, (err) => {
              if (!err) {
                callback(200, {
                  message: "user was successfully deleted",
                });
              } else {
                callback(500, {
                  error: "There has a issue in deleting user",
                });
              }
            });
          } else {
            callback(400, {
              error: "user dose not exist",
            });
          }
        });
      } else {
        callback(401, {
          error: "unauthorized request",
        });
      }
    });
  } else {
    callback(400, {
      error: "Invalid phone number",
    });
  }
};

// exporting module
module.exports = handle;
