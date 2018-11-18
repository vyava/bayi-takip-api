"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
// import .env variables
require('dotenv-safe').load({
    path: path.join(__dirname, '../../.env')
});
module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    socketEnabled: ['1', 'true', 'yes'].indexOf(process.env.SOCKET_ENABLED || '') >= 0,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
    mongo: {
        uri: process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI
    },
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
    // DEFAULT values and limiters
    LIMIT_MAX: 101,
    LIMIT_MIN: 9,
    LIMIT_DEFAULT: 50,
    TAPDK_URL: "http://212.174.130.210/NewTapdk/ViewApp/sorgu.aspx"
};
