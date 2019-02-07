"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const { LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT } = require("../../config/vars");
const bolgeValidation = {
    getBolgeById: {
        query: {
            kod: Joi.number().required().min(100)
        }
    },
    getBolgeBySehir: {
        query: {
            kod: Joi.number().required().min(100)
        }
    },
};
exports.getBolgeById = bolgeValidation.getBolgeById;
