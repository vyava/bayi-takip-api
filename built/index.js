// setup mstime to measure API response time
const http = require("http");
// make bluebird default Promise
// Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
// const https = require('https');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
// open mongoose connection
mongoose.connect();
// HTTPS options
const server = http.createServer(app);
server.listen(port, () => {
    console.info(`--- 🌟  Started (${env}) --- http://localhost:${port}`);
});
/**
 * Exports express
 * @public
 */
module.exports = app;
