"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bayilerRoutes = require('./bayiler.route');
const bolgeRoute = require('./bolge.route');
const distRoute = require('./dist.route');
const userRoute = require('./user.route');
// import {} from "./user.route";
// const authRoutes = require('./auth.route');
const router = express.Router();
/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));
/**
 * GET v1/docs
 */
// router.use('/docs', express.static('docs'));
router.use('/bayiler', bayilerRoutes);
router.use('/bolge', bolgeRoute);
router.use('/dist', distRoute);
router.use('/user', userRoute);
// router.use('/auth', authRoutes);
module.exports = router;