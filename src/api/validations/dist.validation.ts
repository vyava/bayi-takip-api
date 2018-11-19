import * as Joi from 'joi';

import { Dist } from '../models';
const {LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT} = require("../../config/vars");

const distValidation = {
    getDist : {
        query : {
            id : Joi.number().required()
        }
    },
    setDist : {
        query : {
            kod :Joi.string().required(),
            name :Joi.string().required(),
            bolge : Joi.string().required()
        }
    },
    getDistSByAdres : {
        query : {
            il : Joi.string().required(),
            ilce : Joi.string().uppercase().required()
        }
    }
};

export const{getDist, setDist, getDistSByAdres} = distValidation