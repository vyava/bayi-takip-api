import { Request, Response, NextFunction } from 'express';
import { Dist } from '../models/distributor.model';

/**
 * Get distributor
 * @public
 */

export async function getDist(req: Request, res: Response, next: NextFunction) {
  try {
    let id = req.query.id || null
    const dist = await Dist.getDistById(id);
    res.json(dist);
  } catch (err) {
    next(err)
  }
};

export async function setDist(req: Request, res: Response, next: NextFunction) {
  try {
    let payload = req.query || null
    const dist = await Dist.setDist(payload);
    res.json(dist);
  } catch (err) {
    next(err)
  }
};