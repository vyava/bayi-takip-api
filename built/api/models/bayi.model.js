"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose = require('mongoose');
// import * as mongoose from "mongoose";
const mongoose_1 = require("mongoose");
// const httpStatus = require('http-status');
const httpStatus = require("http-status");
const lodash_1 = require("lodash");
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');
/**
 * Bayi Roles
 */
const roles = ['user', 'admin'];
/**
 * Bayi Schema
 * @private
 */
const bayiSchema = new mongoose_1.Schema({
    il: { type: String },
    ilce: { type: String },
    ruhsatNo: { type: String, index: true, unique: true },
    adi: { type: String },
    soyadi: { type: String },
    unvan: { type: String, trim: true },
    sinif: { type: String, trim: true },
    adres: { type: String, trim: true },
    durum: { type: String, trim: true },
    distributor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Test' }
}, { collection: "bayiler" });
bayiSchema.static('getBayilerBySehir', (sehir, options) => __awaiter(this, void 0, void 0, function* () {
    try {
        let bayi = yield exports.Bayi.find({ il: sehir }).select(options.select).limit(options.limit);
        if (lodash_1.isEmpty(bayi))
            throw new APIError({
                message: "Bayi bulunamadı",
                code: httpStatus.NO_CONTENT
            });
        return bayi;
    }
    catch (err) {
        throw err;
    }
}));
bayiSchema.static('getBayiById', (id) => {
    try {
        let bayi = exports.Bayi.find({ _id: id }).populate("distributor");
        if (lodash_1.isEmpty(bayi))
            throw new APIError({
                message: "Bayi bulunamadı",
                code: httpStatus.NO_CONTENT
            });
        return bayi;
    }
    catch (err) {
        throw err;
    }
});
bayiSchema.static('getBayilerByIlce', (sehir, ilce, options) => __awaiter(this, void 0, void 0, function* () {
    try {
        let bayi = yield exports.Bayi.find({
            il: sehir,
            ilce: ilce
        }).select(options.select).limit(options.limit);
        if (lodash_1.isEmpty(bayi))
            throw new APIError({
                message: "Bayi bulunamadı",
                code: httpStatus.NO_CONTENT
            });
        return bayi;
    }
    catch (err) {
        throw err;
    }
}));
bayiSchema.static('setBayi', (options) => {
    try {
        let bayi = new exports.Bayi();
        bayi.il = options.il;
        bayi.ilce = options.ilce;
        return bayi.save();
    }
    catch (err) {
        throw err;
    }
});
/**
 * @typedef Bayi
 */
exports.Bayi = mongoose_1.model("Bayi", bayiSchema);
// bayiSchema.set('toJSON', {
//   virtuals : true,
//   transform : (doc : any, ret : any, options : any) => {
//     delete ret._id
//   }
// })
/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
// userSchema.pre('save', async function save(next: NextFunction) {
//   try {
//     // if (!this.isModified('password')) {
//     //   return next();
//     // }
//     const rounds = env === 'test' ? 1 : 10;
//     // const hash = await bcrypt.hash(this.password, rounds);
//     // this.password = hash;
//     return next();
//   } catch (error) {
//     return next(error);
//   }
// });
/**
 * Methods
 */
// userSchema.method({
//   transform() {
//     const transformed: any = {};
//     const fields = ['id', 'name', 'email', 'picture', 'role', 'createdAt'];
//     fields.forEach(field => {
//       transformed[field] = this[field];
//     });
//     return transformed;
//   },
//   token() {
//     const playload = {
//       exp: moment()
//         .add(jwtExpirationInterval, 'minutes')
//         .unix(),
//       iat: moment().unix(),
//       sub: this._id
//     };
//     return jwt.encode(playload, jwtSecret);
//   },
//   async passwordMatches(password: string) {
//     return bcrypt.compare(password, this.password);
//   }
// });
// userSchema.static("getSehirById", async (id: string) => {
//   return await User.find({})
// })
/**
 * Statics
 */
// userSchema.statics = {
//   // roles,
//   /**
//    * Get user
//    *
//    * @param {ObjectId} id - The objectId of user.
//    * @returns {Promise<User, APIError>}
//    */
//   // async getSehirById(id: any) {
//   //   try {
//   //     let user;
//   //     if (mongoose.Types.ObjectId.isValid(id)) {
//   //       user = await User.find({ il: id }).exec();
//   //       // user = await this.findById(id).exec();
//   //     }
//   //     if (user) {
//   //       return user;
//   //     }
//   //     throw new APIError({
//   //       message: 'User does not exist',
//   //       status: httpStatus.NOT_FOUND
//   //     });
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // },
//   /**
//    * Find user by email and tries to generate a JWT token
//    *
//    * @param {ObjectId} id - The objectId of user.
//    * @returns {Promise<User, APIError>}
//    */
//   // async findAndGenerateToken(options: any) {
//   //   const { email, password, refreshObject } = options;
//   //   if (!email) {
//   //     throw new APIError({ message: 'An email is required to generate a token' });
//   //   }
//   //   const user = await this.findOne({ email }).exec();
//   //   const err: any = {
//   //     status: httpStatus.UNAUTHORIZED,
//   //     isPublic: true
//   //   };
//   //   if (password) {
//   //     if (user && (await user.passwordMatches(password))) {
//   //       return { user, accessToken: user.token() };
//   //     }
//   //     err.message = 'Incorrect email or password';
//   //   } else if (refreshObject && refreshObject.userEmail === email) {
//   //     if (moment(refreshObject.expires).isBefore()) {
//   //       err.message = 'Invalid refresh token.';
//   //     } else {
//   //       return { user, accessToken: user.token() };
//   //     }
//   //   } else {
//   //     err.message = 'Incorrect email or refreshToken';
//   //   }
//   //   throw new APIError(err);
//   // },
//   /**
//    * List users in descending order of 'createdAt' timestamp.
//    *
//    * @param {number} skip - Number of users to be skipped.
//    * @param {number} limit - Limit number of users to be returned.
//    * @returns {Promise<User[]>}
//    */
//   // list(query: any) {
//   //   const { name, email, role } = query;
//   //   const options = omitBy({ name, email, role }, isNil); // allowed filter fields
//   //   const { page = 1, perPage = 30, limit, offset, sort } = getPageQuery(query);
//   //   const result = this.find(options)
//   //     .sort(sort)
//   //     .skip(typeof offset !== 'undefined' ? offset : perPage * (page - 1))
//   //     .limit(typeof limit !== 'undefined' ? limit : perPage)
//   //     .exec();
//   //   return queryPromise(result);
//   // },
//   /**
//    * Return new validation error
//    * if error is a mongoose duplicate key error
//    *
//    * @param {Error} error
//    * @returns {Error|APIError}
//    */
//   checkDuplicateEmail(error: any) {
//     if (error.name === 'MongoError' && error.code === 11000) {
//       return new APIError({
//         message: 'Validation Error',
//         errors: [
//           {
//             field: 'email',
//             location: 'body',
//             messages: ['"email" already exists']
//           }
//         ],
//         status: httpStatus.CONFLICT,
//         isPublic: true,
//         stack: error.stack
//       });
//     }
//     return error;
//   },
//   // async oAuthLogin({ service, id, email, name, picture }: any) {
//   //   const user = await this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] });
//   //   if (user) {
//   //     user.services[service] = id;
//   //     if (!user.name) {
//   //       user.name = name;
//   //     }
//   //     if (!user.picture) {
//   //       user.picture = picture;
//   //     }
//   //     return user.save();
//   //   }
//   //   const password = uuidv4();
//   //   return this.create({
//   //     services: { [service]: id },
//   //     email,
//   //     password,
//   //     name,
//   //     picture
//   //   });
//   // },
//   async count() {
//     return this.find().count();
//   }
// };
