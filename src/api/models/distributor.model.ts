import { Model, Document, Schema, DocumentQuery, model, SchemaType } from "mongoose";
import { IDistributor, IDistributorDocument, IIlce, DistRequest } from '../interface';

import "../models/user.model"

// const httpStatus = require('http-status');
import * as httpStatus from "http-status"
import { IBayiDocumentModel } from "./bayi.model";
const APIError = require('../utils/APIError');
// import * as APIError from "../utils/APIError"

export interface IDistributorDocumentModel extends Model<IDistributorDocument> {
    setDist(payload : Object) : any
    toJSON() : any
}

const distributorSchema: Schema = new Schema(
    {
      name: { type: String, required : true },
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
      bolge: { type: String, required : true},
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
          }
        }
      ]
    },
    {
      collection: "dist",
      toJSON : {
        transform : (doc, ret) => {
          delete ret._id
        }
      },
      timestamps : {
        createdAt : "created_at",
        updatedAt : "updated_at"
      }
    }
  );

  distributorSchema.static('setDist', async (payload: Object) => {
    try {
      let dist = new Dist(payload);
      let result = await dist.save();
      return result;
    } catch (err) {
      throw new APIError(err)
    }
  });

  export const Dist: IDistributorDocumentModel = model<IDistributorDocument, IDistributorDocumentModel>("Dist", distributorSchema);