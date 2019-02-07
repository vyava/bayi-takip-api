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
const mongoose = require("mongoose");
const _ = require("lodash");
require("../models/distributor.model");
require("../models/user.model");
const file_1 = require("../helper/file");
const APIError = require('../utils/APIError');
const bayi_controller_1 = require("./bayi.controller");
const DistModel = mongoose.model("Dist");
const UserModel = mongoose.model("User");
function setDist(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let distData = yield file_1.readExcelFile();
            distData.map((dist) => __awaiter(this, void 0, void 0, function* () {
                let users = dist.userData;
                let _distData = _.pick(dist, ["bolge", "altBolge", "bolgeKod", "name", "kod", "bolgeData", "users"]);
                let distDoc = yield DistModel.findOneAndUpdate({ kod: dist.kod }, _distData, { new: true, upsert: true });
                let userResult = users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    user.distributor = distDoc._id;
                    // user.distributor = distId;
                    let _userDoc = yield UserModel.findOneAndUpdate({ "email.address": user.email.address }, user, { new: true, upsert: true });
                    distDoc.users.push({
                        "_id": _userDoc._id
                    });
                    return _userDoc;
                }));
                Promise.all(userResult).then((r) => {
                    distDoc.save();
                });
            }));
            res.json(distData);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.setDist = setDist;
;
function setDistInfoToBayiler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let dists = yield DistModel.aggregate([
                {
                    $project: {
                        bolgeData: 1
                    }
                }
            ]);
            let result = yield dists.map((dist) => __awaiter(this, void 0, void 0, function* () {
                let _dist = {
                    id: dist._id,
                    iller: _.union(_.map(dist['bolgeData'], "il")),
                    ilceler: _.union(_.map(dist['bolgeData'], "ilce")),
                    altBolge: _.union(_.map(dist['bolgeData'], "altBolge"))
                };
                // return _dist
                return yield bayi_controller_1.setDistsToBayiler(_dist);
            }));
            Promise.all(result)
                .then(ok => {
                res.json(ok);
            })
                .catch(err => {
                throw err;
            });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.setDistInfoToBayiler = setDistInfoToBayiler;
;
function getDistIdsByAdresRoute(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { il, ilce } = req.query;
        let result = yield getDistIdsByAdres([il]);
        res.json(result);
    });
}
exports.getDistIdsByAdresRoute = getDistIdsByAdresRoute;
function getDistIdsByAdres(iller) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (_.isEmpty(iller)) {
                throw new Error("Adres bilgisi bulunmuyor.");
            }
            let distIds = yield DistModel.aggregate([
                {
                    $unwind: "$bolgeData"
                },
                {
                    $match: {
                        "bolgeData.il": {
                            $in: iller
                        }
                    }
                },
                {
                    $group: {
                        _id: "$bolgeData._id",
                        il: {
                            $first: "$bolgeData.il"
                        },
                        ilce: {
                            $first: "$bolgeData.ilce"
                        },
                        distId: {
                            $first: "$_id"
                        },
                        altBolge: {
                            $first: "$altBolge"
                        }
                    }
                }
            ]);
            return distIds;
        }
        catch (err) {
            throw new APIError({
                message: "Bayi bilgileri alınamadı"
            });
        }
    });
}
exports.getDistIdsByAdres = getDistIdsByAdres;
function getDistAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { il, ilce } = req.query;
            let dists = yield getDistIdsByAdres([il]);
            res.json(dists);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getDistAll = getDistAll;
