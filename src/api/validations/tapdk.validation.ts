import * as Joi from 'joi';

const {LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT} = require("../../config/vars");

const requestValidation = {
    getSource : {
        query : {
            gun : Joi.string().uppercase().default("BUGÜN").only(["DÜN", "BUGÜN", "SON_7_GÜN", "TAMAMI", "SON_15_GÜN", "SON_30_GÜN"])
        }
    },
};


export const{ getSource } = requestValidation