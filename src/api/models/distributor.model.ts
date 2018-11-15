import { Model, Document, Schema, DocumentQuery, model } from "mongoose";
import { IDistributor, IDistributorDocument } from '../interface';

// const httpStatus = require('http-status');
import * as httpStatus from "http-status"
const APIError = require('../utils/APIError');
// import * as APIError from "../utils/APIError"

export interface IDistributorDocumentModel extends Model<IDistributorDocument> {
    getDistById(id: string): Promise<IDistributorDocument[]>
    setDist(payload : Object) : any
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
    { collection: "distributor" }
  );

  distributorSchema.static('getDistById', async (id: string) => {
    try {
      let dist = await Dist.findOne({ id: id });
      if(!dist) throw new APIError({
        message : "Distributor bulunamadı",
        status : httpStatus.NOT_FOUND
      });
      return dist;  
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