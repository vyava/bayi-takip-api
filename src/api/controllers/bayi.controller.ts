import { NextFunction, Request, Response } from 'express';
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
import { isEmpty } from "lodash";
import * as mongoose from "mongoose"
import "../models/bayi.model"
import "../models/distributor.model"
import { IBayi, IBayiDocument } from 'api/interface';
const DistModel = mongoose.model("Dist");
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

export async function getBayilerBySehir(req: Request, res: Response, next: NextFunction) {
  try {
    let sehir = req.param('sehir')
    let options = req.query || null
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
    let today = moment().valueOf();
    let yesterday = moment().subtract(1, "days").hours(0).valueOf();

    let bayiler = await BayiModel.find({
      updatedAt: {
        $gte: yesterday
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

export async function getBayilerByGroup(req: Request, res: Response, next: NextFunction) {
  try {
    let yesterday = moment().subtract(1, "days").hours(0).toDate();
    let today = moment().toDate();
    const bayiler = await BayiModel.aggregate([
      {
        $match: {
          $or: [
            {
              ilce: "PENDİK",
            },
            {
              ilce: "ŞİLE"
            }
          ],
          distributor: {
            $exists: true
          },
          // updatedAt: {
          //   $gte: yesterday
          // }
        }
      },
      { $limit: 3 },
      {
        $group: {
          _id: "$altBolge",
          bayiler: {
            $push: {
              il: "$il",
              ilce: "$ilce",
              ruhsatNo: "$ruhsatNo",
              adiSoyadi: "$adiSoyadi",
              unvan: "$unvan",
              sinif: "$sinif",
              adres: "$adres",
              durum: "$durum",
              distributor: {
                $setUnion: ["$distributor._id"]
              }
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
            adiSoyadi: 1,
            unvan: 1,
            sinif: 1,
            adres: 1,
            durum: 1,
            distributor: 1
          },
          distributorData: {
            $reduce: {
              input: "$bayiler.distributor",
              initialValue: [],
              in: {
                $setUnion: ["$$value", "$$this"]
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
            adiSoyadi: 1,
            unvan: 1,
            sinif: 1,
            adres: 1,
            durum: 1,
            distributor: {
              $map: {
                input: "$mailData",
                as: "dist",
                in: {
                  $cond: {
                    if: { $in: ["$$dist._id", "$bayiler.distributor"] },
                    then : "$$dist.name",
                    // then: {
                    //   $cond : {
                    //     if : { $eq : ["$$value", ""]},
                    //     then : "$$dist_.name",
                    //     else : {
                    //       $concat: ["$$value", ", ", "$$dist_.name"]
                    //     }
                    //   }
                    // },
                    else: {
                      $concat: []
                    }
                  }
                }
              }
            }
            // distributor: {
            //   $reduce: {
            //     input: "$mailData",
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
              in: { $concatArrays: ["$$value", "$$this.email"] }
            }
          }
        }
      }
      // {
      //   $project: {
      //     il: 1,
      //     ilce: 1,
      //     ruhsatNo: 1,
      //     adiSoyadi: 1,
      //     unvan: 1,
      //     sinif: 1,
      //     adres: 1,
      //     durum: 1,
      //     // altBolge : { $arrayElemAt : ["$distributor.altBolge", 0] },
      //     // altBolge : ["$distributor.altBolge"],
      //     altBolge: "$distributor.altBolge",
      //     distributorr : "$distributor.name",
      //     distributor: {
      //       $reduce: {
      //         input: "$distributor.name",
      //         initialValue: "",
      //         in: {
      //           $cond: {
      //             if: { $eq: ["$$value", ""] },
      //             then: "$$this",
      //             else: {
      //               $concat: ["$$value", ", ", "$$this"]
      //             }
      //           }
      //         }
      //       }
      //     },
      //     // distributor: ["$distributor.name"],
      //     // users : {
      //     //    $zip : "$distributor.users"
      //     // }
      //     users: {
      //       $reduce: {
      //         input: "$distributor.users",
      //         initialValue: [],
      //         in: { $concatArrays: ["$$value", "$$this.email"] }
      //       }
      //     }
      //   }
      // },
      // {
      //   $unwind: "$altBolge"
      // },
      // {
      //   $group : {
      //     _id : {
      //       altBolge : "$altBolge",
      //       distributor : "$distributorr"
      //     },
      //     bayiler : {
      //       $push : {
      //         il : "$il",
      //         ruhsatNo : "$ruhsatNo"
      //       }
      //     },
      //     users : {
      //       $push : "$users"
      //     }
      //   }
      // }
    ]);
    res.json(bayiler);
  } catch (err) {
    next(err)
  }
}

export async function setValueToBayiler(req: Request, res: Response, next: NextFunction) {
  try {
    let bulk = BayiModel.collection.initializeUnorderedBulkOp();
    let today = moment().valueOf();
    let yesterday = moment().subtract(1, "days").hours(21).valueOf();

    bulk.find({
      // ilce : "KARTAL"
    })
      .update({
        $unset: {
          distributor: 1
        }
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
      $set: {
        altBolge: altBolge[0]
      }
    });

    return await bulk.execute()

  } catch (err) {
    throw new Error(err)
  }
};

export async function updateBayiler(bayiler: IBayi[]) {
  try {
    let updateBulk = BayiModel.collection.initializeUnorderedBulkOp();
    // let processCounter : number = 0;
    bayiler.map((bayi: IBayi) => {
      updateBulk
        .find({
          ruhsatNo: bayi.ruhsatNo
        })
        .upsert()
        .update({
          $setOnInsert: {
            distributor: bayi.distributor,
            createdAt: moment().tz("Europe/Istanbul").toDate()
          },
          $set: {
            il: bayi.il,
            ilce: bayi.ilce,
            adiSoyadi: bayi.adiSoyadi,
            adi: bayi.adi,
            soyadi: bayi.soyadi,
            unvan: bayi.unvan,
            sinif: bayi.sinif,
            adres: bayi.adres,
            durum: bayi.durum,
            updatedAt: moment().tz("Europe/Istanbul").toDate()
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