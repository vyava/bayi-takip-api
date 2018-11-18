"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const { LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT } = require("../../config/vars");
const distValidation = {
    getDist: {
        query: {
            id: Joi.number().required()
        }
    },
    setDist: {
        query: {
            kod: Joi.string().required(),
            name: Joi.string().required(),
            bolge: Joi.string().required()
        }
    }
};
exports.getDist = distValidation.getDist, exports.setDist = distValidation.setDist;
