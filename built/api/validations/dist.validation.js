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
            kod: Joi.number().required(),
            name: Joi.string().required(),
            altBolge: Joi.string().required(),
            bolgeKod: Joi.number().required(),
            bolge: Joi.string().required(),
            cc: Joi.any().required(),
            to: Joi.any().required(),
            status: Joi.boolean().required()
        }
    },
    getDistsByAdres: {
        query: {
            il: Joi.string().required(),
            ilce: Joi.string().required()
        }
    },
    getDistsByIl: {
        params: {
            il: Joi.string().required()
        }
    }
};
exports.getDist = distValidation.getDist, exports.setDist = distValidation.setDist, exports.getDistsByAdres = distValidation.getDistsByAdres, exports.getDistsByIl = distValidation.getDistsByIl;
