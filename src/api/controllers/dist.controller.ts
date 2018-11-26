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
    if(!dist) throw new APIError({
      message : "Distributor bulunamadı",
      status : httpStatus.NOT_FOUND
    });
    return dist;  
  } catch (err) {
    throw new APIError(err)
  }
};

export async function setDist(req: Request, res: Response, next: NextFunction) {
  try {
    let distData : IDistributorDocument[] = await readExcelFile()
    distData.map(async (dist : IDistributorDocument) => {
      let distKod = dist.kod;
      
      
      
      let distId = mongoose.Types.ObjectId();
      
      let userIds : any[] = [];

      let users : IUserDocument[] | undefined = dist.users;
      users.map((user : IUser) => {
        let userId = mongoose.Types.ObjectId();

        user.distributor = distId;
        user._id = userId;
        userIds.push()
        let _user = new UserModel(user);
        _user.save();
      })

      dist._id = distId;
      dist.users = userIds;
      let distData = _.pick(dist, ["_id", "bolgeler", "bolge", "bolgeKod", "name", "kod"]);
      let _dist = new DistModel(distData);
      await _dist.save();

    })
    // distData.map((dist : any) => {
    //   let users : IUser[] = dist.users;
      
    //   users.map((user : IUser) => {
    //     let _user = new UserModel(user);
    //     _user.save()
    //   })
    // })
    // const dist = await Dist.setDist(payload);
    res.json(distData);
  } catch (err) {
    next(err)
  }
};

export async function getDistsByAdres(req : Request, res : Response, next : NextFunction){
  try {
    let adres : DistRequest = req.body;
    let dists = await BolgeModel.findOne(
      {
          "il" : adres.il,
      },
      {
          "ilce" : {
              $elemMatch : {
                  name : adres.ilce
              }
          }
      });
    if(!dists) throw new APIError({
      message : "Distributor bulunamadı",
      status : httpStatus.NOT_FOUND
    });
    return dists;
  } catch (err) {
    throw new APIError(err)
  }
}

export async function getDistsByIl(req : Request, res : Response, next : NextFunction){
  try {
    let il : string = req.params.il || null
    const dists : any = await DistModel.find({
      il : il
    });
    if(_.isEmpty(dists) || dists.length == 0) throw new Error("Distribütör bulunamadı");
    res.json(dists)
  } catch (err) {
    next(err)
  }
}

export async function getDistAll(req : Request, res : Response, next : NextFunction){
  try {
    let dists = await DistModel.find({}).select(["kod", "cc", "to"])
    if(_.isEmpty(dists) || dists.length == 0) throw new APIError({
      message : "Distributor bulunamadı",
      status : httpStatus.NOT_FOUND
    });
    res.send(dists);
  } catch (err) {
    next(err)
  }
}