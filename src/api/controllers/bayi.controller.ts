import { NextFunction, Request, Response } from 'express';
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
import { isEmpty } from "lodash";
import * as mongoose from "mongoose"
import "../models/bayi.model"
import { IBayi } from 'api/interface';
import * as moment from "moment"
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

export async function getBayilerByUpdatedAt(req : Request, res : Response, next : NextFunction){
  try {
    let today = moment().valueOf();
    let yesterday = moment().subtract(1, "days").hours(0).valueOf();

    let bayiler = await BayiModel.find({
      updatedAt : {
        $gte : yesterday
      },
      // updatedAt : today,
      sended : false
    });
    res.json(bayiler);
  } catch (err) {
    throw new APIError({
      message : "Belirtilen tarih ile bayi bulunamadı",
      detail : err
    })
  }
}

export async function setValueToBayiler(req : Request, res : Response, next : NextFunction){
  try {
    let bulk = BayiModel.collection.initializeUnorderedBulkOp();
    let today = moment().valueOf();
    let yesterday = moment().subtract(1, "days").hours(21).valueOf();

    bulk.find({
      ilce : "KARTAL"
    })
      .update({
        $set : {
          createdAt : today,
          updatedAt : today,
          sended : false
        }
      });
    bulk.execute((err, result) => {
      if(err) throw new APIError({
        message : "bulk işlemi başarısız",
        detail : err
      })
      res.json(result)
    })
  } catch (err) {
    next(err)
  }
}

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
};

export async function updateBayiler(bayiler : IBayi[]){
  try {
    let updateBulk = BayiModel.collection.initializeUnorderedBulkOp();
    let processCounter : number = 0;
    let bulkResult : any[] = [];
    bayiler.map((bayi : IBayi, index : number) => {
      updateBulk
      .find({
        ruhsatNo : bayi.ruhsatNo
      })
      .updateOne({...bayi});

      processCounter++;

      if(processCounter % 500 == 0){
        updateBulk.execute(function(err, result){
          if(err) throw err;
            updateBulk = BayiModel.collection.initializeUnorderedBulkOp();
            processCounter = 0;
            bulkResult.push(result)
        })
      }
    });

    if(processCounter > 0){
      updateBulk.execute(function(err, result){
        if(err) throw err;
          updateBulk = BayiModel.collection.initializeUnorderedBulkOp();
          processCounter = 0;
          bulkResult.push(result)
      })
    }
    return bulkResult;
  } catch (err) {
    throw err;
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