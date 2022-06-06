/**
 * Title: uptime monitoring app.
 * Description: a simple uptime monitoring app using raw node js.
 * Author: M.h Sajjad Hossain Ripon
 * Author's Github: https://github.com/mhsajjadhossain
 * Data: Fri,2022-06-03
 * Time: 00:49:24.000-05:00
 */

// All Dependencies
const http = require('http');
const env = require('./src/config/env');

const { handleReqRes } = require('./src/helpers/handleReqRes');

// app object - module scaffolding
const app = {};

// app config settings
app.config = {
    port: process.env.PORT || 5000,
};

// application create server method
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Listening to port:${env.port}`);
    });
};
// handle request response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
