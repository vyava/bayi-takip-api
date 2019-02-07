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
require("../models/distributor.model");
const mongoose = require("mongoose");
require("../models/distributor.model");
require("../models/user.model");
const _ = require("lodash");
const DistModel = mongoose.model("Dist");
const UserModel = mongoose.model("User");
const httpStatus = require("http-status");
const APIError = require('../utils/APIError');
function isUserExist(userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield UserModel.findOne({ "email.address": userEmail });
            return yield user;
        }
        catch (_a) {
            return null;
        }
    });
}
exports.isUserExist = isUserExist;
function getUsersAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield UserModel.find();
            if (_.isEmpty(users) || users.length == 0)
                throw new APIError({
                    message: "Kullanıcı bulunamadı",
                    status: httpStatus.NOT_FOUND
                });
            res.json(users);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getUsersAll = getUsersAll;
;
function getUsersEmailByDist(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let distName = req.query.name;
            let usersEmail = yield UserModel.aggregate([
                {
                    $lookup: {
                        from: "dist",
                        localField: "distributor",
                        foreignField: "_id",
                        as: "distributorler"
                    }
                },
                {
                    $unwind: "$distributorler"
                },
                {
                    $project: {
                        _id: 0,
                        name: "$email.name",
                        address: "$email.address",
                        distName: "$distributorler.name",
                        bolge: "$distributorler.altBolge",
                        taskName: "$taskName",
                        status: "$distributorler.status"
                    }
                },
                {
                    $match: {
                        distName: distName,
                        status: true
                    }
                },
                {
                    $group: {
                        _id: "$taskName",
                        users: {
                            $addToSet: {
                                name: "$name",
                                address: "$address",
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        task: "$_id",
                        users: "$users"
                    }
                }
            ]);
            if (!usersEmail)
                throw new APIError({
                    message: "Kullanıcı email listesi bulunamadı",
                    status: httpStatus.NOT_FOUND
                });
            res.json(usersEmail);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getUsersEmailByDist = getUsersEmailByDist;
;
