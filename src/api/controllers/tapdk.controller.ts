import { Request, Response, NextFunction } from 'express';
import { getSourceFromExternal } from "../helper/tapdk";
/**
 * Get distributor
 * @public
 */

export async function getSource(req: Request, res: Response, next: NextFunction) {
  try {
    let result : any = await getSourceFromExternal()
    
    res.json(result)
  } catch (err) {
    next(err)
  }
};