import { Request, Response, NextFunction } from 'express';
import { getSourceFromExternal } from "../helper/tapdk";
import { addTask, getTask } from "./task.controller";
import { updateBayiler } from './bayi.controller';
/**
 * Get distributor
 * @public
 */

export async function getSource(req: Request, res: Response, next: NextFunction) {
  try {
    let gun : string = req.query.gun
    let result = await addTask();
    let task = await getTask();
    res.json(task)
    // let bayiler : any[] = await getSourceFromExternal(gun)
    // let result = await updateBayiler(bayiler, gun);
    // res.json(bayiler[0].unvan)
    // res.json(bayiler)
  } catch (err) {
    next(err)
  }
};