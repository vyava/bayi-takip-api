import { Model, Document, Schema, DocumentQuery, model } from "mongoose";
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
import { IBayiDocument } from '../interface';


export interface IBayiDocumentModel extends Model<IBayiDocument> { }

/**
 * Bayi Roles
 */
const roles = ['user', 'admin'];

/**
 * Bayi Schema
 * @private
 */
const bayiSchema: Schema = new Schema(
  {
    il: { type: String },
    ilce: { type: String },
    ruhsatNo: { type: String, index: true, unique: true },
    adi: { type: String },
    soyadi: { type: String },
    unvan: { type: String, trim: true },
    sinif: { type: String, trim: true },
    adres: { type: String, trim: true },
    durum: { type: String, trim: true },
    distributor : [{type : Schema.Types.ObjectId, ref : 'Test'}]
  },
  { collection: "bayiler" }
);


/**
 * @typedef Bayi
 */

export const Bayi: IBayiDocumentModel = model<IBayiDocument, IBayiDocumentModel>("Bayi", bayiSchema);


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

