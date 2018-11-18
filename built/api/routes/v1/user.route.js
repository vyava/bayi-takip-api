"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const validate = require('express-validation');
const userController = require("../../controllers/");
const validations_1 = require("../../validations");
const router = express.Router();
// GET /v1/bolge?kod={bolgeKod}
router
    .route('/')
    .get(validate(validations_1.getUser), userController.getDist);
router
    .route('/yeni')
    .get(validate(validations_1.setUser), userController.setDist);
module.exports = router;
