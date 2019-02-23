import { Request, Response, NextFunction } from 'express';
import { getSourceFromExternal } from "../helper/tapdk";
import { findTaskById, taskDone, taskError, taskBlock} from "./task.controller";
import { updateBayiler } from './bayi.controller';
/**
 * Get distributor
 * @public
 */

async function getSource(req: Request, res: Response, next: NextFunction) {
  try {
    let {params, taskId} = req.body;
    
    let bayiler : any[] = await getSourceFromExternal(params);
    let _task = await findTaskById(taskId)
      .then(_task => {
        return taskBlock(_task);
      })
      .catch(() => {
        throw new Error(`Task bloke edilemedi ${_task.active}`)
      })
    // let result = await updateBayiler(bayiler)
    //   .then((_result) => {
    //     taskDone(_task)
    //     return _result
    //   })
    //   .catch(() => {
    //     taskError(_task)
    //     throw new Error(`Task bloke edilemedi ${_task.active}`)
    //   })
    res.json(bayiler)
  } catch (err) {
    next(err)
  }
};

module.exports = getSource