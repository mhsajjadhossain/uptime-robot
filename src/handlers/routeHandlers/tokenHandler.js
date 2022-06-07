/**
 * Title: Tokens Handler
 * Description: All user tokens are handling here
 * Author: M.h Sajjad Hossain Ripon
 * Author's Github: https://github.com/mhsajjadhossain
 * Data: Sun,2022-06-05
 * Time: 21:43:10.000-05:00
 */
// dependencies
const {
  hash,
  parseJSON,
  generateRandomString,
} = require("../../helpers/utilities");
const { update } = require("../../lib/data");
const data = require("../../lib/data");
// handle object - module scaffolding.
const handle = {};

handle.tokenHandler = (requestProperties, callback) => {
  // all allowed methods
  const allowedMethods = ["get", "post", "put", "delete"];
  const { method } = requestProperties;
  if (allowedMethods.indexOf(method) > -1) {
    handle._tokens[method](requestProperties, callback);
  } else {
    callback(405);
  }
};

// _tokens object - containing all users methods and properties
handle._tokens = {};
/**
 * @title : Get user controller
 * @method get
 * @query : baseurl.com/users?phone=01912033222
 * @Auth : true
 */
handle._tokens.get = (requestProperties, callback) => {
  const { query } = requestProperties;
  const phone =
    typeof query?.phone === "string" && query?.phone.trim().length === 11
      ? query?.phone
      : false;
  const token =
    typeof requestProperties.headers?.token === "string" &&
    requestProperties.headers?.token.trim().length === 20
      ? requestProperties.headers?.token
      : false;
  console.log(requestProperties.headers?.token.trim().length);
  if (phone && token) {
    data.read("tokens", token, (tokenReadErr, tokenObj) => {
      const tokenData = { ...parseJSON(tokenObj) };

      const isTokenMatched = tokenData.id === token;
      const isPhoneMatched = tokenData.phone === phone;
      const isExpired = tokenData.expires > Date.now();

      if (!tokenReadErr && isTokenMatched && isPhoneMatched && isExpired) {
        callback(200, tokenData);
      } else {
        callback(404, {
          error: "Invalid Token.!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There is a problem in request!",
    });
  }
};
/**
 * @title : Genarate Tokens Controller
 * @method post
 * @sample_request_body : {
 *  "phone": "01913055200",
 *  "password": "secret12"
 * }
 *
 */
handle._tokens.post = (requestProperties, callback) => {
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

  // check if all fields are available
  if (phone && password) {
    data.read("users", phone, (err, user) => {
      if (!err) {
        // verifying user
        let isPasswordMatched = parseJSON(user).password === hash(password);
        let isPhoneMatched = parseJSON(user).phone === phone;

        if (isPasswordMatched && isPhoneMatched) {
          // creating token object
          const tokenObj = {
            id: generateRandomString(20),
            phone,
            expires: Date.now() + 60 * 60 * 1000,
          };
          // Storing token to db
          data.create("tokens", tokenObj.id, tokenObj, (err) => {
            if (!err) {
              callback(200, tokenObj);
            } else {
              callback(500, { error: "There is a problem in server side!" });
            }
          });
        } else {
          callback(403, {
            error: "There is a problem in your request.",
          });
        }
      } else {
        callback(400, { error: "There is a problem in the request!" });
      }
    });
  } else {
    callback(400, { error: "There is a problem in the request!" });
  }
};
/**
 * @title : Update Token Controller
 * @method put
 * @Auth : true
 * @sample_request_body : {
 *  "id": "alsjfalsvlksaiosfjlasdk",
 *  "extends":true/false
 * }
 */
handle._tokens.put = (requestProperties, callback) => {
  const token =
    typeof requestProperties.body?.id === "string" &&
    requestProperties.body?.id.trim().length === 20
      ? requestProperties.body?.id
      : false;

  const isExtends =
    typeof requestProperties.body?.extends === "boolean" &&
    requestProperties.body?.extends
      ? requestProperties.body?.extends
      : false;

  if (token && isExtends) {
    // lookup for token
    data.read("tokens", token, (readErr, tokenData) => {
      let tokenObj = { ...parseJSON(tokenData) };
      const isExpired = tokenObj.expires < Date.now();

      if (!isExpired) {
        tokenObj.expires = Date.now() + 60 * 60 * 1000;
        data.update("tokens", token, tokenObj, (updateErr) => {
          if (!updateErr) {
            callback(200, {
              message: "token updated successfully!",
            });
          } else {
            callback(500, {
              error: "There is a problem in server side",
            });
          }
        });
      } else {
        callback(401, {
          error: "Token Already Expired!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There is a problem in your request!",
    });
  }
};

/**
 * @title : delete token controller
 * @method delete
 * @Auth : true
 * @query : baseurl.com/users?id=01912033222
 */
handle._tokens.delete = (requestProperties, callback) => {
  const token =
    typeof requestProperties.query?.id === "string" &&
    requestProperties.query?.id.trim().length === 20
      ? requestProperties.query?.id
      : false;
  if (token) {
    data.read("tokens", token, (err) => {
      if (!err) {
        callback(200, {
          error: "Token Successfully Deleted",
        });
      } else {
        callback(500, {
          error: "There is a problem in server side!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There have a problem with your request.",
    });
  }
};

/**
 * @title : token verify function
 * @params id,phone,callback
 */
handle._tokens.verify = (id, phone, callback) => {
  // lookup for the token
  data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      const isPhoneMatched = parseJSON(tokenData).phone === phone;
      const isExpired = parseJSON(tokenData).expires < Date.now();
      if (isPhoneMatched && !isExpired) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};
// exporting module
module.exports = handle;
