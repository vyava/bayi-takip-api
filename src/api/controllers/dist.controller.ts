import { Request, Response, NextFunction } from 'express';
import { DistRequest, IIlce, IDistributor, IUser, IDistributorDocument, IUserDocument } from '../interface';
import * as mongoose from "mongoose"
import * as _ from "lodash"
import "../models/distributor.model"
import "../models/user.model"
import "../models/bolge.model"
import { readExcelFile } from '../helper/file';

import * as httpStatus from "http-status"
const APIError = require('../utils/APIError');

import { setDistsToBayiler } from "./bayi.controller";

const DistModel = mongoose.model("Dist");
const UserModel = mongoose.model("User");
const BolgeModel = mongoose.model("Bolge");


/**
 * Get distributor
 * @public
 */

export async function getDist(req: Request, res: Response, next: NextFunction) {
  try {
    let dist = await DistModel.findOne({ kod: req.body.kod });
    if (!dist) throw new APIError({
      message: "Distributor bulunamadı",
      status: httpStatus.NOT_FOUND
    });
    return dist;
  } catch (err) {
    throw new APIError(err)
  }
};

export async function setDist(req: Request, res: Response, next: NextFunction) {
  try {
    let distData: IDistributor[] = await readExcelFile();
    distData.map(async (dist: IDistributor) => {
      let users = dist.userData;
      let _distData = _.pick(dist, ["bolge", "altBolge", "bolgeKod", "name", "kod", "bolgeData", "users"]);
      let distDoc : any = await DistModel.findOneAndUpdate( { kod: dist.kod }, _distData, { new: true, upsert: true } );
      let userIds : any[] = []
      let userResult : any = users.map(async (user: IUser) => {
        user.distributor = distDoc._id;
        // user.distributor = distId;
        let _userDoc = await UserModel.findOneAndUpdate({ "email.address": user.email.address }, user, { new: true, upsert: true })
        distDoc.users.push(_userDoc._id)
        return _userDoc
      });
      Promise.all(userResult).then((r : any) => {
        distDoc.save()
      })
    })
    res.json(distData);
  } catch (err) {
    next(err)
  }
};

export async function setDistInfoToBayiler(req: Request, res: Response, next: NextFunction){
  try {
    let dists = await DistModel.aggregate([
      {
        $project : {
          bolgeData : 1
        }
      }
    ]);
    let result : any[] = await dists.map(async dist => {
      let _dist =  {
        id : dist._id,
        iller : _.union(_.map(dist['bolgeData'], "il")),
        ilceler : _.union(_.map(dist['bolgeData'], "ilce"))
      }
      // return _dist
      return await setDistsToBayiler(_dist)
    });

    Promise.all(result)
      .then(ok => {
        res.json(ok)
      })
      .catch(err => {
        throw err
      })
  } catch (err) {
    next(err)
  }
}

export async function getDistsByAdres(req: Request, res: Response, next: NextFunction) {
  try {
    let adres: DistRequest = req.query;
    let dists = await DistModel.find({
      bolgeData: {
        $elemMatch: {
          il: adres.il,
          ilce: adres.ilce
        }
      }
    }).populate("users")
    if (_.isEmpty(dists) || dists.length == 0) throw new APIError({
      message: "Distributor bulunamadı",
      status: httpStatus.NOT_FOUND
    });
    res.json(dists);
  } catch (err) {
    next(err)
  }
}

export async function getDistsByIl(req: Request, res: Response, next: NextFunction) {
  try {
    let il: string = req.params.il || null
    const dists: any = await DistModel.find({
      bolgeData: {
        $elemMatch: {
          il: il
        }
      }
    });
    if (_.isEmpty(dists) || dists.length == 0) throw new Error("Distribütör bulunamadı");
    res.json(dists)
  } catch (err) {
    next(err)
  }
}

export async function getDistAll(req: Request, res: Response, next: NextFunction) {
  try {
    let dists = await DistModel.find({}).select(["kod", "cc", "to"])
    if (_.isEmpty(dists) || dists.length == 0) throw new APIError({
      message: "Distributor bulunamadı",
      status: httpStatus.NOT_FOUND
    });
    res.send(dists);
  } catch (err) {
    next(err)
  }
}