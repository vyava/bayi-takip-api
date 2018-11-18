"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const validate = require('express-validation');
const bolgeController = require("../../controllers/bolge.controller");
const validations_1 = require("../../validations");
const router = express.Router();
// GET /v1/bolge?kod={bolgeKod}
router
    .route('/')
    .get(bolgeController.getBolge);
router
    .route('/yeni')
    .get(validate(validations_1.setBolge), bolgeController.setBolge);
module.exports = router;
