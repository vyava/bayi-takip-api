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
    .get(validate(validations_1.getBolgeById), bolgeController.getBolgeById);
module.exports = router;
