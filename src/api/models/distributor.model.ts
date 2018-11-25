import { Model, Document, Schema, DocumentQuery, model } from "mongoose";
import { IDistributor, IDistributorDocument, IIlce, DistRequest } from '../interface';
import { Bolge } from "./bolge.model";

// const httpStatus = require('http-status');
import * as httpStatus from "http-status"
import { IBayiDocumentModel } from "./bayi.model";
const APIError = require('../utils/APIError');
// import * as APIError from "../utils/APIError"

export interface IDistributorDocumentModel extends Model<IDistributorDocument> {
    getDistById(id: number): IDistributorDocument
    setDist(payload : Object) : any
    getDistsByAdres(adres : DistRequest) : IDistributorDocument
    getDistAll() : IDistributorDocument[]
    toJSON() : any
}

const distributorSchema: Schema = new Schema(
    {
      name: { type: String, required : true },
      status: { type: Boolean, default : true },
      dsm: { type: String },
      tte: { type: String },
      operator: { type: String },
      scope: { type: String },
      bolge: { type: String, required : true}
    },
    {
      collection: "dist",
      toJSON : {
        transform : (doc, ret) => {
          delete ret._id
        }
      }
    }
  );

  distributorSchema.static('getDistById', async (kod: number) => {
    try {
      let dist = await Dist.findOne({ kod: kod });
      if(!dist) throw new APIError({
        message : "Distributor bulunamadı",
        status : httpStatus.NOT_FOUND
      });
      return dist;  
    } catch (err) {
      throw new APIError(err)
    }
  });

  distributorSchema.static('getDistsByAdres', async (adres: DistRequest) => {
    try {
      let dists = await Bolge.getDistsByAdres(adres)
      if(!dists) throw new APIError({
        message : "Distributor bulunamadı",
        status : httpStatus.NOT_FOUND
      });
      return dists;
    } catch (err) {
      throw new APIError(err)
    }
  });

  distributorSchema.static('getDistAll', async (adres: DistRequest) => {
    try {
      let dists = Dist.find().select(["kod", "cc", "to"])
      if(!dists) throw new APIError({
        message : "Distributor bulunamadı",
        status : httpStatus.NOT_FOUND
      });
      return dists;
    } catch (err) {
      throw new APIError(err)
    }
  });

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