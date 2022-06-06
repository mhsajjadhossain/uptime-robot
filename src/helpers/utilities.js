/**
 * Title: Utility Functions
 * Description: All utility functions contains here
 * Author: M.h Sajjad Hossain Ripon
 * Author's Github: https://github.com/mhsajjadhossain
 * Data: Sat,2022-06-04
 * Time: 00:30:54.000-05:00
 */
// dependencies
const env = require("../config/env");
const crypto = require("crypto");
// utilities object - module scaffolding.
const utilities = {};

// parse string to valid js
utilities.parseJSON = (jsonString) => {
  let parsedJson;
  try {
    parsedJson = JSON.parse(jsonString);
  } catch (error) {
    parsedJson = {};
  }
  return parsedJson;
};
/**
 * create hash from string
 * @type String
 * @return Hashed String
 */
utilities.hash = (str) => {
  let hash;
  try {
    hash = crypto.createHmac("sha256", env.secret).update(str).digest("hex");
  } catch (error) {
    console.log("Error: Have some issue to create hash");
  }
  return hash;
};
/**
 * create hash from string
 * @type Number (string lenth)
 * @return Random Generated String
 */

utilities.generateRandomString = (stringLength) => {
  const validLength =
    typeof stringLength === "number" && stringLength > 0 ? stringLength : false;
  if (!validLength) return false;
  // generateRandomString
  const characterSet = "abcdefghijklmnopqrstuvwxyz1234567890";
  let output = "";

  for (let i = 1; i <= validLength; i++) {
    let randomChar = characterSet.charAt(
      Math.floor(Math.random() * characterSet.length)
    );
    output += randomChar;
  }
  return output;
};

// console.log(utilities.generateRandomString(30));
// exporting module
module.exports = utilities;
