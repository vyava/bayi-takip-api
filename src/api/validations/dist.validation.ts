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
            kod :Joi.number().required(),
            name :Joi.string().required(),
            bolge : Joi.string().required(),
            bolgeKod : Joi.number().required(),
            bolgeler : Joi.string().required(),
            cc: Joi.any().required(),
            to: Joi.any().required(),
            status : Joi.boolean().required()
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