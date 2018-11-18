"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const validate = require('express-validation');
const distController = require("../../controllers/dist.controller");
const validations_1 = require("../../validations");
const router = express.Router();
// GET /v1/bolge?kod={bolgeKod}
router
    .route('/')
    .get(validate(validations_1.getDist), distController.getDist);
router
    .route('/yeni')
    .get(validate(validations_1.setDist), distController.setDist);
module.exports = router;
