import { Request, Response, NextFunction } from 'express';
import { getSourceFromExternal } from "../helper/tapdk";
import { updateBayiler } from './bayi.controller';
/**
 * Get distributor
 * @public
 */

export async function getSource(req: Request, res: Response, next: NextFunction) {
  try {
    let gun : string = req.query.gun
    
    let bayiler : any[] = await getSourceFromExternal(gun)
    let result = await updateBayiler(bayiler, gun);
    // res.json(bayiler[0].unvan)
    res.json(result)
  } catch (err) {
    next(err)
  }
};