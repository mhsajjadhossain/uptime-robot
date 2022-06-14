/**
 * Title: validation
 * Description: all type of data validation method are includes here.
 * Author: M.h Sajjad Hossain Ripon
 * Author's Github: https://github.com/mhsajjadhossain
 * Data: Wed,2022-06-08
 * Time: 10:19:28.000-05:00
 */
// validation object - module scaffolding.
const validation = {};
// config object
validation.config = {};
// phone validation
validation.isValidPhone = (phone) => {
  return typeof phone === "string" && phone.trim().length === 11
    ? phone
    : false;
};
// token validation
validation.isValidToken = (token) => {
  return typeof token === "string" && token.trim().length === 20
    ? token
    : false;
};
// password validation
validation.isValidPassword = (password) => {
  return typeof password === "string" && password.trim().length >= 8
    ? password
    : false;
};
// name validation
validation.isValidName = (name) => {
  return typeof name === "string" && name.trim().length > 0 ? name : false;
};
// boolean validation
validation.isBoolean = (booleanStr) => {
  return typeof booleanStr === "boolean" ? booleanStr : false;
};
// method validation
validation.isValidMethod = (str) => {
  return typeof str === "string" &&
    str.length > 0 &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(str) > -1
    ? str
    : false;
};
// url validation
validation.isValidUrl = (str) => {
  return typeof str === "string" && str.length > 0 ? str : false;
};
validation.isValidStatusCode = (array) => {
  return typeof array === "object" && array instanceof Array && array.length > 0
    ? array
    : false;
};
validation.isValidTimeOut = (timeoutSeconds) => {
  return typeof timeoutSeconds === "number" &&
    timeoutSeconds !== 0 &&
    timeoutSeconds <= 5
    ? timeoutSeconds
    : false;
};
// method validation
validation.isValidProtocol = (str) => {
  return typeof str === "string" &&
    str.length > 0 &&
    ["http", "https"].indexOf(str) > -1
    ? str
    : false;
};
// exporting module
module.exports = validation;
