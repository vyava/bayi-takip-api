export {};
// import * as Joi from 'joi';
import {extend, array, string, number } from 'joi';
// const Joi = require("joi")
import { Bayi } from '../models';
const {LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT} = require("../../config/vars")

const custom = extend({
  base : array(),
  name : "stringArray",
  coerce : (value : string, state, options) => (( value && value.includes(",")) ? value.split(",") : [value, "-_id"]) || ["il", "-_id"],
  // pre : (value, state, options) => {
  //   // İlçeler virgülle ayrılmışsa eğer virgülden split et, değilse eğer dizi içinde value döndür
  //   return value.includes(",") ? value.split(",") : [value];
  // }
})

// Custom validation for selection
const selectValidate = custom.stringArray().items(string()).sparse();

const limitSchema = number().less(LIMIT_MAX).greater(LIMIT_MIN).default(LIMIT_DEFAULT);
const sehirSchema = string().only(["ADANA", "ANKARA", "İSTANBUL", "ORDU"]).uppercase().required()


var validation : any = {
  // GET /v1/bayiler/{sehir}
  getSehir: {
    query: {
      // sehir: Joi.string().max(5).required(),
      limit : limitSchema,
      select : selectValidate
      // perPage: Joi.number()
      //   .min(1)
      //   .max(100),
      // name: Joi.string(),
      // email: Joi.string(),
      // role: Joi.string().valid(User.roles)
    },
    params : {
      sehir : sehirSchema
    }
  },

  // GET /v1/bayiler/{sehir}/{ilce}
  getIlce: {
    query: {
      limit   : limitSchema,
      select  : selectValidate
    },
    params : {
      sehir : sehirSchema,
      ilce  : string().uppercase()
    }
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: {
      email: string()
        .email()
        .required(),
      password: string()
        .min(6)
        .max(128)
        .required(),
      name: string().max(128),
      // role: Joi.string().valid(User.roles)
    },
    params: {
      userId: string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      email: string().email(),
      password: string()
        .min(6)
        .max(128),
      name: string().max(128),
      // role: Joi.string().valid(User.roles)
    },
    params: {
      userId: string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  }
}

export const{getSehir, getIlce} = validation