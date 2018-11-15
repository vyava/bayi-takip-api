import * as Joi from 'joi';

import { Bolge } from '../models';
const {LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT} = require("../../config/vars");

const bolgeValidation = {
    setBolge : {
        query : {
            kod : Joi.number().required().min(100),
            name : Joi.string().required().uppercase(),
            distributor : Joi.any().default([])
        }
    }
};

export const{setBolge} = bolgeValidation