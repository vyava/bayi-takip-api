export {};
import { NextFunction, Request, Response } from 'express';
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
import { isEmpty } from "lodash";
import * as mongoose from "mongoose"
import "../models/bayi.model"
import {Dist} from "../models/distributor.model"
import { IBayi, IBayiDocument } from 'api/interface';
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

export async function setDistsToBayiler(dist : any){
  try {
    let {id, iller, ilceler} = dist
    let bulk = BayiModel.collection.initializeUnorderedBulkOp();
    bulk.find({
      $and : [
        {
          il : {
            $in : iller
          }
        },
        {
          ilce : {
            $in : ilceler
          }
        }
      ]
    }).update({
      $push : {
        distributor : id
      }
    });

    return await bulk.execute()
    
  } catch (err) {
    throw new Error(err)
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