import { Request, Response, NextFunction } from 'express';
import {  IDistributor, IUser } from '../interface';
import * as mongoose from "mongoose"
import * as _ from "lodash"
import { Dist } from "../models/distributor.model"
import { User } from "../models/user.model";
import { readExcelFile } from '../helper/file';

import * as httpStatus from "http-status"
const APIError = require('../utils/APIError');

import { setDistsToBayiler } from "./bayi.controller";

declare global {
  interface String {
    turkishToLower(str: string): string;
    turkishToUpper(str: string): string;
  }
}

String.prototype.turkishToLower = function () {
  var string = this;
  var letters = { "İ": "i", "I": "ı", "Ş": "ş", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç" };
  string = string.replace(/(([İIŞĞÜÇÖ]))/g, function (letter) { return letters[letter]; })
  return string.toLowerCase();
}

String.prototype.turkishToUpper = function () {
  var string = this;
  var letters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" };
  string = string.replace(/(([iışğüçö]))/g, function (letter) { return letters[letter]; })
  return string.toUpperCase();
}


export async function setDist(req: Request, res: Response, next: NextFunction) {
  try {
    let distData: IDistributor[] = await readExcelFile();
    distData.map(async (dist: IDistributor) => {
      let users = dist.userData;
      let _distData = _.pick(dist, ["bolge", "altBolge", "bolgeKod", "name", "kod", "bolgeData", "users"]);
      let distDoc: any = await Dist.findOneAndUpdate({ kod: dist.kod }, _distData, { new: true, upsert: true });
      let userResult: any = users.map(async (user: IUser) => {
        user.distributor = distDoc._id;
        // user.distributor = distId;
        let _userDoc = await User.findOneAndUpdate({ "email.address": user.email.address }, user, { new: true, upsert: true })
        distDoc.users.push({
          "_id": _userDoc._id
        }
        )
        return _userDoc
      });
      Promise.all(userResult).then((r: any) => {
        distDoc.save()
      })
    })
    res.json(distData);
  } catch (err) {
    next(err)
  }
};

export async function setDistInfoToBayiler(req: Request, res: Response, next: NextFunction) {
  try {
    let dists = await Dist.aggregate([
      {
        $project: {
          bolgeData: 1
        }
      }
    ]);
    let result: any[] = await dists.map(async dist => {
      let _dist = {
        id: dist._id,
        iller: _.union(_.map(dist['bolgeData'], "il")),
        ilceler: _.union(_.map(dist['bolgeData'], "ilce")),
        altBolge: _.union(_.map(dist['bolgeData'], "altBolge"))
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
};

export async function getDistIdsByAdresRoute(req: Request, res: Response, next: NextFunction){
  let {il, ilce} = <any>req.query;
  let iller = il.split(",").map((_: any) => _.turkishToUpper());
  let result = await Dist.getDistsIdByAdres(iller)
  res.json(result)
}

export async function getDistIdsByAdres(iller: string[]): Promise<mongoose.Types.ObjectId[]> {
  try {
    if (_.isEmpty(iller)) {
      throw new Error("Adres bilgisi bulunmuyor.")
    };
    return await Dist.getDistsIdByAdres(iller);
  } catch (err) {
    throw new APIError({
      message: "Bayi bilgileri alınamadı"
    });
  }
}

export async function getDistAll(req: Request, res: Response, next: NextFunction) {
  try {
    let { il } = <any>req.query;
    let iller = il.split(",").map((_: any) => _.turkishToUpper());
    let dists = await getDistIdsByAdres(iller);
    res.json(dists)
  } catch (err) {
    next(err)
  }
}