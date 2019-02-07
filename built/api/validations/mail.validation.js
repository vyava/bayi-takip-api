"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const { LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT } = require("../../config/vars");
const mailValidation = {
    send: {
        query: {
            gun: Joi.string().required().uppercase().allow(["DÜN", "BUGÜN"])
        }
    },
};
exports.send = mailValidation.send;
