import { Request, Response, NextFunction } from 'express';
import { getSourceFromExternal } from "../helper/tapdk";
import { addTask, getTask, findTaskById} from "./task.controller";
import { updateBayiler } from './bayi.controller';
/**
 * Get distributor
 * @public
 */

export async function getSource(req: Request, res: Response, next: NextFunction) {
  try {
    let {param, taskId} = req.body;
    // let result = await addTask();
    
    
    let bayiler : any[] = await getSourceFromExternal(param);
    let _task = await findTaskById(taskId)
    _task.active = true;
    await _task.save();
    // let result = await updateBayiler(bayiler, gun);
    // res.json(bayiler[0].unvan)
    res.json(bayiler)
  } catch (err) {
    next(err)
  }
};