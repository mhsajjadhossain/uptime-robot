/**
 * Title: Request response handler
 * Description: Request Response Handler Module.
 * Author: M.h Sajjad Hossain Ripon
 * Author's Github: https://github.com/mhsajjadhossain
 * Data: Fri,2022-06-03
 * Time: 15:57:32.000-05:00
 */
// All Dependencies
const { StringDecoder } = require("string_decoder");
const url = require("url");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");
const routes = require("../routes/allRoutes");
const { parseJSON } = require("./utilities");
// handler object - module scaffolding.
const handler = {};

// handle request response
handler.handleReqRes = (req, res) => {
  // handling request
  // get parsed url
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const { query } = parsedUrl;
  const { headers } = req;
  const decoder = new StringDecoder("utf-8");
  let realData = "";
  const choosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;
  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    query,
    headers,
  };

  // decode request bodys data
  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    requestProperties.body = parseJSON(realData);

    // choosenHandler
    choosenHandler(requestProperties, (statusCode, payload) => {
      try {
        const status = typeof statusCode === "number" ? statusCode : 500;
        const payloadData = typeof payload === "object" ? payload : {};
        const payloadString = JSON.stringify(payloadData);
        // handling response
        res.setHeader("Content-type", "application/json");
        res.writeHead(status);
        res.end(payloadString);
      } catch (error) {
        console.log(error);
      }
    });
  });
};

// exporting module
module.exports = handler;
