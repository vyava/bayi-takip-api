"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const { LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT } = require("../../config/vars");
const bolgeValidation = {
    setBolge: {
        query: {
            kod: Joi.number().required().min(100),
            name: Joi.string().required().uppercase(),
            distributor: Joi.any().default([])
        }
    }
};
exports.setBolge = bolgeValidation.setBolge;
