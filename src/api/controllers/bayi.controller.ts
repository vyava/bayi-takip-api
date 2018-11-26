export {};
import { NextFunction, Request, Response } from 'express';
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
import { isEmpty } from "lodash";
import * as mongoose from "mongoose"
import "../models/bayi.model"
// import { Bayi } from '../models/bayi.model';

const BayiModel = mongoose.model("Bayi");
// import { startTimer, apiJson } from 'api/utils/Utils';
const { handler: errorHandler } = require('../middlewares/error');


/**
 * Get user
 * @public
 */

export async function getBayilerBySehir(req : Request, res : Response, next : NextFunction){
  try {
    let sehir = req.param('sehir')
    let options = req.query || null
    let bayiler = await BayiModel.find({ il: sehir }).select(options.select).limit(options.limit);
    if(isEmpty(bayiler)) throw new APIError({
      message : "Bayi bulunamadı",
      code : httpStatus.NO_CONTENT
    });
    res.send(bayiler);
  } catch (err) {
    next(err)
  }
};

export async function getBayilerByIlce(req : Request, res : Response, next : NextFunction){
  try {
    let sehir = req.param('sehir');
    let ilce = req.param('ilce');
    let options = req.query || null;
    let bayi = await BayiModel.find({ 
      il: sehir,
      ilce: ilce 
    }).select(options.select).limit(options.limit)  
    
    if(isEmpty(bayi)) throw new APIError({
      message : "Bayi bulunamadı",
      code : httpStatus.NO_CONTENT
    });
    res.send(bayi);
  } catch (err) {
    next(err)
  }
}

export async function setBayi(req : Request, res : Response, next : NextFunction){
  try {
    let options = req.query;
    const bayi = await BayiModel.findById("5bec0317ee6fd214c80bf9af");
    res.json(bayi);  
  } catch (err) {
    next(err)
  }
}

export async function getBayiById(req : Request, res : Response, next : NextFunction){
  try{
    let kod = req.query.kod;
    let bayi = BayiModel.find({ kod: kod }).populate("distributor");
    if(isEmpty(bayi)) throw new APIError({
      message : "Bayi bulunamadı",
      code : httpStatus.NO_CONTENT
    });
    res.send(bayi)
  }catch(err) {
    next(err)
  }
  
}
/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req: Request, res: Response) => res.json(req.route.meta.user.transform());

// exports.get = async (req: Request, res : Response, next : NextFunction) => {
//     try{
//         let user = new User();
//     }catch(err){
//         throw new Error(err)
//     }
// }

/**
 * Create new user
 * @public
 */
// exports.create = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = new User(req.body);
//     const savedUser = await user.save();
//     res.status(httpStatus.CREATED);
//     res.json(savedUser.transform());
//   } catch (error) {
//     next(User.checkDuplicateEmail(error));
//   }
// };

/**
 * Replace existing user
 * @public
 */
// exports.replace = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { user } = req.route.meta;
//     const newUser = new User(req.body);
//     const ommitRole = user.role !== 'admin' ? 'role' : '';
//     const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

//     await user.update(newUserObject, { override: true, upsert: true });
//     const savedUser = await User.findById(user._id);

//     res.json(savedUser.transform());
//   } catch (error) {
//     next(User.checkDuplicateEmail(error));
//   }
// };

/**
 * Update existing user
 * @public
 */
// exports.update = (req: Request, res: Response, next: NextFunction) => {
//   const ommitRole = req.route.meta.user.role !== 'admin' ? 'role' : '';
//   const updatedUser = omit(req.body, ommitRole);
//   const user = Object.assign(req.route.meta.user, updatedUser);

//   user
//     .save()
//     .then((savedUser: any) => res.json(savedUser.transform()))
//     .catch((e: any) => next(User.checkDuplicateEmail(e)));
// };


/**
 * Delete user
 * @public
 */
// exports.remove = (req: Request, res: Response, next: NextFunction) => {
//   const { user } = req.route.meta;

//   user
//     .remove()
//     .then(() => res.status(httpStatus.NO_CONTENT).end())
//     .catch((e: any) => next(e));
// };
