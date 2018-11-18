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
const httpStatus = require('http-status');
const bayi_model_1 = require("../models/bayi.model");
// import { startTimer, apiJson } from 'api/utils/Utils';
const { handler: errorHandler } = require('../middlewares/error');
/**
 * Load user and append to req.
 * @public
 */
function load(req, res, next, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = new bayi_model_1.Bayi();
            req.route.meta.user = user;
            return next();
        }
        catch (error) {
            return errorHandler(error, req, res);
        }
    });
}
exports.load = load;
;
/**
 * Get user
 * @public
 */
function getSehir(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let sehir = req.param('sehir');
            let options = req.query || null;
            console.log(options);
            const user = yield bayi_model_1.Bayi.getBayilerBySehir(sehir, options);
            res.json(user);
        }
        catch (err) {
            console.log("hatalar....................");
            next(err);
        }
    });
}
exports.getSehir = getSehir;
;
function getIlce(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let sehir = req.param('sehir');
            let ilce = req.param('ilce');
            let options = req.query || null;
            console.log(options);
            const user = yield bayi_model_1.Bayi.getBayilerByIlce(sehir, ilce, options);
            res.json(user);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getIlce = getIlce;
function setBayi(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let options = req.query;
            const bayi = yield bayi_model_1.Bayi.findById("5bec0317ee6fd214c80bf9af");
            res.json(bayi);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.setBayi = setBayi;
function getBayiById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let ruhsatNo = req.query.ruhsatNo;
            // let _bayi = await Bayi.findById("5bea83dbaf8c949699482755");
            const bayi = yield bayi_model_1.Bayi.find({ ruhsatNo: ruhsatNo });
            // bayi.distributor = _bayi._id;
            // bayi.save();
            res.json(bayi);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getBayiById = getBayiById;
/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.route.meta.user.transform());
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
