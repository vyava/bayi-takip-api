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
const APIError = require('../utils/APIError');
const lodash_1 = require("lodash");
const mongoose = require("mongoose");
require("../models/bayi.model");
require("../models/distributor.model");
const DistModel = mongoose.model("Dist");
const date_1 = require("../helper/date");
// import {Dist} from "../models/distributor.model"
// import { IBayi, IBayiDocument } from 'api/interface';
// import { Bayi } from '../models/bayi.model';
const BayiModel = mongoose.model("Bayi");
// import { startTimer, apiJson } from 'api/utils/Utils';
// const { handler: errorHandler } = require('../middlewares/error');
/**
 * Get user
 * @public
 */
function getBayilerBySehir(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let sehir = req.param('sehir');
            let options = req.query || null;
            let bayiler = yield BayiModel.find({ il: sehir }).select(options.select).limit(options.limit);
            if (lodash_1.isEmpty(bayiler))
                throw new APIError({
                    message: "Bayi bulunamadı",
                    code: httpStatus.NO_CONTENT
                });
            res.send(bayiler);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getBayilerBySehir = getBayilerBySehir;
;
function getBayilerByUpdatedAt(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { start } = date_1.getDate("BUGÜN");
            let bayiler = yield BayiModel.find({
                updatedAt: {
                    $gte: start
                },
                // updatedAt : today,
                sended: false
            });
            res.json(bayiler);
        }
        catch (err) {
            throw new APIError({
                message: "Belirtilen tarih ile bayi bulunamadı",
                detail: err
            });
        }
    });
}
exports.getBayilerByUpdatedAt = getBayilerByUpdatedAt;
function getBayilerByGroup(gun = "BUGÜN") {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { start, end } = date_1.getDate(gun);
            console.log("********************************");
            console.info(start, end);
            const bayiler = yield BayiModel.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                updatedAt: {
                                    $gte: start
                                }
                            },
                            {
                                updatedAt: {
                                    $lte: end
                                }
                            },
                            {
                                altBolge: {
                                    $exists: true,
                                    $ne: null
                                }
                            },
                            {
                                distributor: {
                                    $exists: true,
                                    $ne: null
                                }
                            }
                        ]
                    }
                },
                {
                    $sort: {
                        "distributor._id": 1,
                        durum: 1
                    }
                },
                // { $limit: 100 },
                {
                    $lookup: {
                        from: "dist",
                        let: { "distId": "$distributor" },
                        pipeline: [
                            {
                                $match: { $expr: { $in: ["$_id", "$$distId"] } },
                            }
                        ],
                        as: "distributor"
                    }
                },
                {
                    $group: {
                        _id: "$altBolge",
                        bayiler: {
                            $push: {
                                il: "$il",
                                ilce: "$ilce",
                                ruhsatNo: "$ruhsatNo",
                                ruhsatTipleri: "$ruhsatTipleri",
                                adiSoyadi: "$adiSoyadi",
                                unvan: "$unvan",
                                sinif: "$sinif",
                                sinifDsd: "$sinifDsd",
                                adres: "$adres",
                                durum: "$durum",
                                createdAt: "$createdAt",
                                updatedAt: "$updatedAt",
                                distributor: {
                                    $setUnion: ["$distributor"]
                                },
                                altBolge: "$altBolge"
                            }
                        }
                    }
                },
                {
                    $project: {
                        bayiler: {
                            il: 1,
                            ilce: 1,
                            ruhsatNo: 1,
                            ruhsatTipleri: 1,
                            adiSoyadi: 1,
                            unvan: 1,
                            sinif: 1,
                            sinifDsd: 1,
                            adres: 1,
                            durum: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            distributor: {
                                _id: 1,
                                name: 1
                            },
                            altBolge: 1
                        },
                        distributorData: {
                            $reduce: {
                                input: "$bayiler.distributor",
                                initialValue: [],
                                in: {
                                    $setUnion: ["$$value", "$$this._id"]
                                }
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "dist",
                        let: { "distId": "$distributorData" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$_id", "$$distId"] } } },
                            {
                                $lookup: {
                                    from: "users",
                                    let: { "users": "$users" },
                                    pipeline: [
                                        { $match: { $expr: { $in: ["$_id", "$$users"] } } },
                                    ],
                                    as: "users"
                                }
                            }
                        ],
                        as: "mailData"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        bayiler: {
                            il: 1,
                            ilce: 1,
                            ruhsatNo: 1,
                            ruhsatTipleri: 1,
                            adiSoyadi: 1,
                            unvan: 1,
                            sinif: 1,
                            sinifDsd: 1,
                            adres: 1,
                            durum: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            altBolge: 1,
                            distributor: {
                                name: 1
                            }
                            // distributor: {
                            //   $reduce: {
                            //     input: "$bayiler.distributor",
                            //     initialValue: "",
                            //     in: {
                            //       $cond: {
                            //         if: { $eq: ["$$value", ""] },
                            //         then: "$$this.name",
                            //         else: {
                            //           $concat: ["$$value", ", ", "$$this.name"]
                            //         }
                            //       }
                            //     }
                            //   }
                            // }
                        },
                        users: {
                            $reduce: {
                                input: "$mailData.users",
                                initialValue: [],
                                in: { $concatArrays: ["$$value", "$$this"] }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        bayiler: 1,
                        users: {
                            email: {
                                name: 1,
                                address: 1
                            },
                            taskName: 1
                        }
                    }
                }
            ]);
            return bayiler;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.getBayilerByGroup = getBayilerByGroup;
function setValueToBayiler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let bulk = BayiModel.collection.initializeUnorderedBulkOp();
            let { start } = date_1.getDate("AYBAŞI");
            bulk.find({
            // ilce : "KARTAL"
            })
                .update({
                $unset: {
                    // distributor: 1,
                    // altBolge : 1,
                    // createdAt : start,
                    ruhsatTipleri: 1
                    // updatedAt: start
                },
            });
            bulk.execute((err, result) => {
                if (err)
                    throw new APIError({
                        message: "bulk işlemi başarısız",
                        detail: err
                    });
                res.json(result);
            });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.setValueToBayiler = setValueToBayiler;
function setDistsToBayiler(dist) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // console.log(dist)
            let { id, iller, ilceler, altBolge } = dist;
            let bulk = BayiModel.collection.initializeUnorderedBulkOp();
            bulk.find({
                $and: [
                    {
                        il: {
                            $in: iller
                        }
                    },
                    {
                        ilce: {
                            $in: ilceler
                        }
                    }
                ]
            }).update({
                $push: {
                    distributor: {
                        "_id": id
                    }
                },
            });
            return yield bulk.execute();
        }
        catch (err) {
            throw new Error(err);
        }
    });
}
exports.setDistsToBayiler = setDistsToBayiler;
;
function updateBayiler(bayiler) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let date = new Date();
            let updateBulk = BayiModel.collection.initializeUnorderedBulkOp();
            // let processCounter : number = 0;
            bayiler.map((bayi) => {
                updateBulk
                    .find({
                    ruhsatNo: bayi.ruhsatNo
                })
                    .upsert()
                    .updateOne({
                    $setOnInsert: {
                        createdAt: date
                    },
                    $set: {
                        ruhsatTipleri: bayi.ruhsatTipleri,
                        il: bayi.il,
                        ilce: bayi.ilce,
                        adiSoyadi: bayi.adiSoyadi,
                        adi: bayi.adi,
                        soyadi: bayi.soyadi,
                        unvan: bayi.unvan,
                        sinif: bayi.sinif,
                        sinifDsd: bayi.sinifDsd,
                        adres: bayi.adres,
                        durum: bayi.durum,
                        updatedAt: date,
                        altBolge: bayi.altBolge,
                        distributor: bayi.distributor
                    }
                });
                // processCounter++;
                // if(processCounter % 100 == 0){
                //   updateBulk.execute(function(err, result){
                //     if(err) throw err;
                //       updateBulk = BayiModel.collection.initializeUnorderedBulkOp();
                //       processCounter = 0;
                //       bulkResult.push(result)
                //   })
                // }
            });
            // if(processCounter > 0){
            return new Promise((resolve, reject) => {
                updateBulk.execute(function (err, result) {
                    if (err)
                        reject(err);
                    // updateBulk = BayiModel.collection.initializeUnorderedBulkOp();
                    // processCounter = 0;
                    // bulkResult.push(result)
                    resolve(result);
                });
            });
            // }
            // return bulkResult;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.updateBayiler = updateBayiler;
function getBayiByRuhsatNo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let ruhsatNo = req.query.ruhsatNo;
            let bayi = yield BayiModel.findOne({ ruhsatNo: ruhsatNo }).populate("distributor");
            bayi.adi = "ZAFER GENÇ";
            bayi.save();
            // if (isEmpty(bayi)) throw new APIError({
            //   message: "Bayi bulunamadı",
            //   code: httpStatus.NOT_FOUND
            // });
            res.send(bayi);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getBayiByRuhsatNo = getBayiByRuhsatNo;
