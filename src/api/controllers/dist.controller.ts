import { Request, Response, NextFunction } from 'express';
import { Dist } from '../models/distributor.model';
import { DistRequest, IIlce } from 'api/interface';

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

export async function getDistSByAdres(req : Request, res : Response, next : NextFunction){
  try {
    let adres : DistRequest = req.query || null
    const dists : any = await Dist.getDistsByAdres(adres);
    if(dists["ilce"].length==0) throw new Error("Distribütör bulunamadı");
    res.json(dists)
  } catch (err) {
    next(err)
  }
}