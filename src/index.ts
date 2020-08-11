// setup mstime to measure API response time
const http = require("http")

// make bluebird default Promise
// Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env, socketEnabled } = require('./config/vars');

// const https = require('https');
const spdy = require('spdy'); // for HTTP2
const fs = require('fs');
const app = require('./config/express');

const mongoose = require('./config/mongoose');

// open mongoose connection
mongoose.connect();
// HTTPS options
const options = {
  // key: fs.readFileSync('./src/config/https/key.pem'),
  // cert: fs.readFileSync('./src/config/https/cert.pem')
};
// const server = spdy.createServer(options, app);
const server = http.createServer(app)


server.listen(port, () => {
  console.info(`--- 🌟  Startedd (${env}) --- http://localhost:${port}`);
});

/**
 * Exports express
 * @public
 */
module.exports = app;
