export {};
import * as Joi from 'joi';
// const Joi = require("joi")
import { Bayi } from '../models';
const {LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT} = require("../../config/vars")

const custom = Joi.extend({
  base : Joi.array(),
  name : "stringArray",
  coerce : (value, state, options) => (value.split ? value.split(",") : value)
})

// Custom validation for selection
const selectValidate = custom.stringArray().items(Joi.string()).single();


const validation = {
  // GET /v1/users
  getSehir: {
    query: {
      // sehir: Joi.string().max(5).required(),
      limit : Joi.number().less(LIMIT_MAX).greater(LIMIT_MIN).default(LIMIT_DEFAULT),
      select : selectValidate
      // perPage: Joi.number()
      //   .min(1)
      //   .max(100),
      // name: Joi.string(),
      // email: Joi.string(),
      // role: Joi.string().valid(User.roles)
    },
    params : {
      sehir : Joi.string().only(["ADANA", "ANKARA", "İSTANBUL", "ORDU"]).uppercase().required(),
      ilce : Joi.string().uppercase()
    }
  },

  // POST /v1/users
  createUser: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(128)
        .required(),
      name: Joi.string().max(128),
      // role: Joi.string().valid(User.roles)
    }
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(128)
        .required(),
      name: Joi.string().max(128),
      // role: Joi.string().valid(User.roles)
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(),
      password: Joi.string()
        .min(6)
        .max(128),
      name: Joi.string().max(128),
      // role: Joi.string().valid(User.roles)
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  }
};

export const{getSehir} = validation