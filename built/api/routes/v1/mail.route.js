"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const validate = require("express-validation");
const router = express.Router();
const mailController = require("../../controllers/mail.controller");
const mail_validation_1 = require("../../validations/mail.validation");
router
    .route("/")
    .get(validate(mail_validation_1.send), mailController.send);
module.exports = router;
