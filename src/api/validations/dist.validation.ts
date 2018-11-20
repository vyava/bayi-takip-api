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
    getDistsByAdres : {
        query : {
            il : Joi.string().required(),
            ilce : Joi.string().uppercase().required()
        }
    },
    getDistsByIl : {
        params : {
            il : Joi.string().required().uppercase()
        }
    }
};

export const{getDist, setDist, getDistsByAdres, getDistsByIl} = distValidation