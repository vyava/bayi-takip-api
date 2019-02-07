"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const validate = require('express-validation');
const userController = require("../../controllers/user.controller");
const validations_1 = require("../../validations");
const router = express.Router();
// GET /v1/bolge?kod={bolgeKod}
router
    .route('/')
    .get(userController.getUsersAll);
router
    .route('/dist')
    .get(validate(validations_1.getEmails), userController.getUsersEmailByDist);
module.exports = router;
