import { NextFunction, Request, Response, Router } from 'express';
import "../models/distributor.model"
import * as mongoose from "mongoose";
import "../models/distributor.model"
import "../models/user.model"
import * as _ from "lodash"
const DistModel = mongoose.model("Dist");
const UserModel = mongoose.model("User");

import * as httpStatus from "http-status"
const APIError = require('../utils/APIError');



export async function getUsersAll(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await UserModel.find();
        if (_.isEmpty(users) || users.length == 0) throw new APIError({
            message: "Kullanıcı bulunamadı",
            status: httpStatus.NOT_FOUND
        });
        res.json(users);
    } catch (err) {
        next(err)
    }
};

export async function getUsersEmailByDist(req: Request, res: Response, next: NextFunction) {
    try {
        let distName = req.query.name;
        let usersEmail = await UserModel.aggregate([
            {
                $lookup : {
                    from : "dist",
                    localField : "distributor",
                    foreignField : "_id",
                    as : "distributorler"
                }
            },
            {
                $unwind : "$distributorler"
            },
            {
                $project : {
                    _id : 0,
                    name : "$email.name",
                    address : "$email.address",
                    distName : "$distributorler.name",
                    bolge : "$distributorler.altBolge",
                    taskName : "$taskName",
                    status : "$distributorler.status"
                }
            },
            {
                $match : {
                    distName : distName,
                    status : true
                }
            },
            {
                $group : {
                    _id : "$taskName",
                    users : {
                        $addToSet : {
                            name : "$name",
                            address : "$address",
                        }
                    }
                }
            },
            {
                $project : {
                    _id : 0,
                    task : "$_id",
                    users : "$users"
                }
            }
        ]);
        if(!usersEmail) throw new APIError({
            message: "Kullanıcı email listesi bulunamadı",
            status: httpStatus.NOT_FOUND
        });
        res.json(usersEmail);
    } catch (err) {
        next(err)
    }
};
