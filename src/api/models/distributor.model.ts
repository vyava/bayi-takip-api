import { Model, Document, Schema, DocumentQuery, model, SchemaType } from "mongoose";
import { IDistributor, IDistributorDocument, IIlce, DistRequest } from '../interface';

import "../models/user.model"

// const httpStatus = require('http-status');
import * as httpStatus from "http-status"
import { IBayiDocumentModel } from "./bayi.model";
const APIError = require('../utils/APIError');
// import * as APIError from "../utils/APIError"

export interface IDistributorDocumentModel extends Model<IDistributorDocument> {
    getDistsIdByAdres(adres : string[]) : any
    toJSON() : any
}

const distributorSchema: Schema = new Schema(
    {
      name: { type: String, default : "TANIMSIZ" },
      status: { type: Boolean, default : true },
      users : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
      }],
      kod : {
        type : Number,
        required : true,
        unique : true,
        index : true
      },
      bolge: { type: String, default : "TANIMSIZ"},
      altBolge : { type : String, default : "TANIMSIZ" },
      bolgeData : [
        {
          il : {
            type : String,
            uppercase : true,
            require : true
          },
          ilce : {
            type : String,
            uppercase : true,
            require : true
          },
          altBolge : {
            type : String,
            uppercase : true,
            require : true
          }
        }
      ]
    },
    {
      collection: "dist",
      // toJSON : {
      //   transform : (doc, ret) => {
      //     delete ret._id
      //   }
      // },
      timestamps : {
        createdAt : "created_at",
        updatedAt : "updated_at"
      }
    }
  );

  distributorSchema.set('toJSON', {
    virtuals : true,
    transform : (doc : any, ret : any, options : any) => {
      delete ret._id
    }
  })

  
  distributorSchema.static('getDistsIdByAdres', async (iller: string[]) => {
    try {
      let distIds = await Dist.aggregate([
      
        {
          $unwind : "$bolgeData"
        },
        {
          $match : {
            "bolgeData.il" : {
                $in : iller
              }
          }
        },
        {
          $group : {
            _id : "$bolgeData._id",
            il : {
              $first : "$bolgeData.il"
            },
            ilce : {
              $first : "$bolgeData.ilce"
            },
            distId : {
              $first : "$_id"
            },
            altBolge : {
              $first : "$altBolge"
            }
          }
        }
      ]);
      return distIds;
    } catch (err) {
      throw new APIError(err)
    }
  });

  export const Dist: IDistributorDocumentModel = model<IDistributorDocument, IDistributorDocumentModel>("Dist", distributorSchema);