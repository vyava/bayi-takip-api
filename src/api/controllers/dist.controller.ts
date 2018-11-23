import { Request, Response, NextFunction } from 'express';
import { DistRequest, IIlce } from '../interface';
import { Bolge, Dist } from '../models';
import { readExcelFile } from '../helper/file';

/**
 * Get distributor
 * @public
 */

export async function getDist(req: Request, res: Response, next: NextFunction) {
  try {
    let kod = req.query.kod || null
    const dist = await Dist.getDistById(kod);
    res.json(dist);
  } catch (err) {
    next(err)
  }
};

export async function setDist(req: Request, res: Response, next: NextFunction) {
  try {
    let count = await readExcelFile()
    
    // const dist = await Dist.setDist(payload);
    res.json(count);
  } catch (err) {
    next(err)
  }
};

export async function getDistsByAdres(req : Request, res : Response, next : NextFunction){
  try {
    let adres : DistRequest = req.query || null
    const dists : any = await Dist.getDistsByAdres(adres);
    if(dists["ilce"].length==0) throw new Error("Distribütör bulunamadı");
    res.json(dists)
  } catch (err) {
    next(err)
  }
}

export async function getDistsByIl(req : Request, res : Response, next : NextFunction){
  try {
    let il : string = req.params.il || null
    const dists : any = await Bolge.getDistsByIl(il);
    if(!dists) throw new Error("Distribütör bulunamadı");
    res.json(dists)
  } catch (err) {
    next(err)
  }
}

export async function getDistAll(req : Request, res : Response, next : NextFunction){
  try {
    const dists : any = await Dist.getDistAll();
    if(!dists) throw new Error("Distribütör bulunamadı");



    res.json(dists)
  } catch (err) {
    next(err)
  }
}