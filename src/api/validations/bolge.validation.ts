import * as Joi from 'joi';

import { Bolge } from '../models';
const {LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT} = require("../../config/vars");

const bolgeValidation = {
    getBolgeById : {
        query : {
            kod : Joi.number().required().min(100)
        }
    },
    getBolgeBySehir : {
        query : {
            kod : Joi.number().required().min(100)
        }
    },
};

export const{getBolgeById} = bolgeValidation