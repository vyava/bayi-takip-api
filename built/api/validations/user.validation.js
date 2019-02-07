"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const { LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT } = require("../../config/vars");
const distValidation = {
    getUser: {
        query: {
            id: Joi.number().required()
        }
    },
    setUser: {
        query: {
            name: Joi.string().required()
        }
    },
    getEmails: {
        query: {
            name: Joi.string().required().uppercase()
        }
    }
};
exports.getUser = distValidation.getUser, exports.setUser = distValidation.setUser, exports.getEmails = distValidation.getEmails;
