export {};
// import * as Joi from 'joi';
import * as Joi from 'joi';
// const Joi = require("joi")
import { Bayi } from '../models';
const {LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT} = require("../../config/vars")

const SELECT_CUSTOM_VALIDATE = Joi.extend({
  base : Joi.array(),
  name : "stringArray",
  coerce : (value : string, state, options) => 
    (( value && value.includes(","))
        ? value.split(",") 
        : [value]) || ["il"]
})

// Custom validation for selection
const SELECT_VALIDATE
  = SELECT_CUSTOM_VALIDATE
    .stringArray()
    .items(Joi.string())
    .sparse();

const LIMIT_VALIDATE
  = Joi
    .number()
    .less(LIMIT_MAX)
    .greater(LIMIT_MIN)
    .default(LIMIT_DEFAULT);

const SEHIR_VALIDATE
  = Joi
    .string()
    .uppercase()
    .required();


var bayiValidation : any = {
  // GET /v1/bayiler/{sehir}
  getSehir: {
    query: {
      // sehir: Joi.string().max(5).required(),
      limit : LIMIT_VALIDATE,
      select : SELECT_VALIDATE
      // perPage: Joi.number()
      //   .min(1)
      //   .max(100),
      // name: Joi.string(),
      // email: Joi.string(),
      // role: Joi.string().valid(User.roles)
    },
    params : {
      sehir : SEHIR_VALIDATE
    }
  },

  // GET /v1/bayiler/{sehir}/{ilce}
  getIlce: {
    query: {
      limit   : LIMIT_VALIDATE,
      select  : SELECT_VALIDATE
    },
    params : {
      sehir : SEHIR_VALIDATE,
      ilce  : Joi.string().uppercase()
    }
  },

  // GET /v1/bayi
  getBayi : {
    query : {
      ruhsatNo : Joi.string().required().regex(/^[0-9]{7,11}PT$/g)
    }
  }
}

export const{getSehir, getIlce, getBayi} = bayiValidation