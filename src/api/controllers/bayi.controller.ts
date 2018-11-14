export {};
import { NextFunction, Request, Response, Router } from 'express';
const httpStatus = require('http-status');
import { Bayi } from '../models/bayi.model';
// import { startTimer, apiJson } from 'api/utils/Utils';
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load user and append to req.
 * @public
 */
export async function load (req: Request, res: Response, next: NextFunction, id: any) {
  try {
    let user = new Bayi();
    req.route.meta.user = user;
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get user
 * @public
 */

export async function getSehir(req : Request, res : Response){
  let sehir = req.param('sehir')
  let options = req.query || null
  console.log(options)
  const user = await Bayi.getBayilerBySehir(sehir, options);
  
  // console.log(user.getSehirById(sehir));
  // user.toString;
  // let result = await user.getSehirById(sehir)
  res.json(user);
};

export async function getIlce(req : Request, res : Response){
  let sehir = req.param('sehir');
  let ilce = req.param('ilce');
  let options = req.query || null;
  console.log(options)
  const user = Bayi.getBayilerByIlce(sehir, ilce, options);
  
  
  res.json(user);
}

export async function setBayi(req : Request, res : Response){
  let options = req.query;
  const bayi = await Bayi.findById("5bec0317ee6fd214c80bf9af");
  res.json(bayi);
}

export async function findBayiById(req : Request, res : Response){
  try{
    let id = req.query.id;
    let _bayi = await Bayi.findById("5bea83dbaf8c949699482755");
    const bayi = await Bayi.findById(id).populate("distributor");
    // bayi.distributor = _bayi._id;
    // bayi.save();
    res.json(bayi);
  }catch(err) {
    res.json(err)
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
