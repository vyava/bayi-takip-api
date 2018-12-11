import * as Joi from 'joi';

const {LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT} = require("../../config/vars");

const mailValidation = {
    send : {
        query : {
            gun : Joi.string().required().uppercase().allow(["DÜN", "BUGÜN"])
        }
    },
};

export const{ send } = mailValidation