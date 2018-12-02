import { Request, Response, NextFunction } from 'express';
import { getSourceFromExternal } from "../helper/tapdk";
import { IBayi } from 'api/interface';
import "../models/distributor.model"
import * as mongoose from "mongoose";
import { updateBayiler } from './bayi.controller';
const DistModel = mongoose.model("Dist");
/**
 * Get distributor
 * @public
 */

export async function getSource(req: Request, res: Response, next: NextFunction) {
  try {
    let gun = req.query.gun
    let bayiler : any[] = await getSourceFromExternal(gun)
    // let result = await updateBayiler(bayiler);
    // res.json(bayiler[0].unvan)
    res.json(bayiler)
  } catch (err) {
    next(err)
  }
};