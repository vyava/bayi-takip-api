import * as Joi from 'joi';

const {LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT} = require("../../config/vars");

const distValidation = {
    getUser : {
        query : {
            id : Joi.number().required()
        }
    },
    setUser : {
        query : {
            kod :Joi.string().required(),
            name :Joi.string().required(),
            bolge : Joi.string().required()
        }
    }
};

export const{getUser, setUser} = distValidation