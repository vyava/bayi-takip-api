import * as Joi from 'joi';

const {LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT} = require("../../config/vars");

const requestValidation = {
    getSource : {
        query : {
            gun : Joi.number().required()
        }
    },
};

export const{ getSource } = requestValidation