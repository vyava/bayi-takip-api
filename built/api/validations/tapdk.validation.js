"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const { LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT } = require("../../config/vars");
const requestValidation = {
    getSource: {
        query: {
            gun: Joi.string().uppercase().default("BUGÜN").only(["DÜN", "BUGÜN", "SON_7_GÜN", "TAMAMI", "SON_15_GÜN", "SON_30_GÜN"])
        }
    },
};
exports.getSource = requestValidation.getSource;
