export {};
const httpStatus = require('http-status');
const passport = require('passport');
// import { User } from 'api/models';
const APIError = require('../utils/APIError');

const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';

import * as Bluebird from 'bluebird';
// declare global {
//   export interface Promise<T> extends Bluebird<T> {}
// }


exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;


exports.oAuth = (service: any) => passport.authenticate(service, { session: false });
