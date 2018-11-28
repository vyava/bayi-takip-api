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
            name :Joi.string().required()
        }
    },
    getEmails : {
        query : {
            name : Joi.string().required().uppercase()
        }
    }
};

export const{getUser, setUser, getEmails} = distValidation