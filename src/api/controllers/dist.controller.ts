import { Request, Response, NextFunction } from 'express';
import { DistRequest, IIlce, IDistributor, IUser } from '../interface';
import * as mongoose from "mongoose"
import { Bolge, Dist, User } from '../models';
import { readExcelFile } from '../helper/file';
const DistModel = mongoose.model("Dist");
const UserModel = mongoose.model("User");


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
    let distData : any[] = await readExcelFile()
    distData.map((dist : any) => {
      let users : IUser[] = dist.users;
      users.map((user : IUser) => {
        let _user = new User(user);
        _user.save()
      })
    })
    // const dist = await Dist.setDist(payload);
    res.json(distData);
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
    // const dists : any = await Dist.getDistAll();
    let dists = await DistModel.findOne({
      kod : 1
    });
    if(!dists) throw new Error("Distribütör bulunamadı");



    res.json(dists)
  } catch (err) {
    next(err)
  }
}