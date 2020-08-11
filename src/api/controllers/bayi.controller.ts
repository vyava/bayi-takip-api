import { NextFunction, Request, Response } from 'express';
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
import { isEmpty } from "lodash";
import * as mongoose from "mongoose"
import "../models/bayi.model"
import "../models/distributor.model"
import { IBayi, IBayiDocument } from '../../api/interface';
const DistModel = mongoose.model("Dist");
import { getDate } from "../helper/date";
// import {Dist} from "../models/distributor.model"
// import { IBayi, IBayiDocument } from 'api/interface';
// import { Bayi } from '../models/bayi.model';
const BayiModel = mongoose.model("Bayi");

import * as moment from "moment"
// import { startTimer, apiJson } from 'api/utils/Utils';
// const { handler: errorHandler } = require('../middlewares/error');


/**
 * Get user
 * @public
 */

export async function getBayilerBySehir(req: Request, res: Response, next: NextFunction) {
  try {
    let sehir = req.param('sehir')
    let options = <any>req.query || null
    let bayiler = await BayiModel.find({ il: sehir }).select(options.select).limit(options.limit);
    if (isEmpty(bayiler)) throw new APIError({
      message: "Bayi bulunamadı",
      code: httpStatus.NO_CONTENT
    });
    res.send(bayiler);
  } catch (err) {
    next(err)
  }
};

export async function getBayilerByUpdatedAt(req: Request, res: Response, next: NextFunction) {
  try {
    let { start } = getDate("BUGÜN");

    let bayiler = await BayiModel.find({
      updatedAt: {
        $gte: start
      },
      // updatedAt : today,
      sended: false
    });
    res.json(bayiler);
  } catch (err) {
    throw new APIError({
      message: "Belirtilen tarih ile bayi bulunamadı",
      detail: err
    })
  }
}

export async function getBayilerByGroup(req : Request, res : Response, next : NextFunction) {
  try {
    let _g = req.query.gun || "DÜN";
    let {start, end} = getDate(_g)
    console.log("********************************")
    console.info(start, end)
    const bayiler = await BayiModel.aggregate([
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
        $sort : {
          "distributor._id" : 1,
          durum : 1
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
              ruhsatTipleri : "$ruhsatTipleri",
              adiSoyadi: "$adiSoyadi",
              unvan: "$unvan",
              sinif: "$sinif",
              sinifDsd : "$sinifDsd",
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
            ruhsatTipleri : 1,
            adiSoyadi: 1,
            unvan: 1,
            sinif: 1,
            sinifDsd : 1,
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
            ruhsatTipleri : 1,
            adiSoyadi: 1,
            unvan: 1,
            sinif: 1,
            sinifDsd : 1,
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
    
    
    res.json(bayiler);
  } catch (err) {
    res.json(err);
  }
}

export async function setValueToBayiler(req: Request, res: Response, next: NextFunction) {
  try {
    let bulk = BayiModel.collection.initializeUnorderedBulkOp();
    let { start } = getDate("AYBAŞI");
    bulk.find({
      // ilce : "KARTAL"
    })
      .update({
        $unset: {
          // distributor: 1,
          // altBolge : 1,
          // createdAt : start,
          ruhsatTipleri : 1
          // updatedAt: start
        },
      });
    bulk.execute((err, result) => {
      if (err) throw new APIError({
        message: "bulk işlemi başarısız",
        detail: err
      })
      res.json(result)
    })
  } catch (err) {
    next(err)
  }
}

export async function setDistsToBayiler(dist: any) {
  try {
    // console.log(dist)
    let { id, iller, ilceler, altBolge } = dist
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
      // $set: {
      //   altBolge: altBolge[0]
      // }
    });
    return await bulk.execute()

  } catch (err) {
    throw new Error(err)
  }
};

export async function updateBayiler(bayiler: IBayi[]) {
  try {

    let date = new Date();
    let updateBulk = BayiModel.collection.initializeUnorderedBulkOp();
    // let processCounter : number = 0;
    bayiler.map((bayi: IBayi) => {
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
            ruhsatTipleri : bayi.ruhsatTipleri,
            il: bayi.il,
            ilce: bayi.ilce,
            adiSoyadi: bayi.adiSoyadi,
            adi: bayi.adi,
            soyadi: bayi.soyadi,
            unvan: bayi.unvan,
            sinif: bayi.sinif,
            sinifDsd : bayi.sinifDsd,
            adres: bayi.adres,
            durum: bayi.durum,
            updatedAt: date,
            altBolge: bayi.altBolge,
            distributor: bayi.distributor
          }
        })

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
        if (err) reject(err);
        // updateBulk = BayiModel.collection.initializeUnorderedBulkOp();
        // processCounter = 0;
        // bulkResult.push(result)
        resolve(result)
      })
    })

    // }
    // return bulkResult;
  } catch (err) {
    throw err;
  }
}

export async function getBayiByRuhsatNo(req: Request, res: Response, next: NextFunction) {
  try {
    let ruhsatNo = req.query.ruhsatNo;
    let bayi: IBayiDocument = await BayiModel.findOne({ ruhsatNo: ruhsatNo }).populate("distributor");
    bayi.adi = "ZAFER GENÇ"
    bayi.save();
    // if (isEmpty(bayi)) throw new APIError({
    //   message: "Bayi bulunamadı",
    //   code: httpStatus.NOT_FOUND
    // });
    res.send(bayi)
  } catch (err) {
    next(err)
  }

}