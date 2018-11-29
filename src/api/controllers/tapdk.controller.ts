import { Request, Response, NextFunction } from 'express';
import { getSourceFromExternal } from "../helper/tapdk";
import { IBayi } from 'api/interface';
import "../models/distributor.model"
import * as mongoose from "mongoose";
const DistModel = mongoose.model("Dist");
/**
 * Get distributor
 * @public
 */

export async function getSource(req: Request, res: Response, next: NextFunction) {
  try {
    let bayiler : IBayi[] = await getSourceFromExternal()

    // res.json(bayiler[0].unvan)
    res.json(bayiler)
  } catch (err) {
    next(err)
  }
};