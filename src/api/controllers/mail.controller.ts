import { NextFunction, Request, Response } from 'express';
import { getBayilerByGroup } from "../controllers/bayi.controller";
import { addValuesToWorksheet } from "../helper/excel";


export async function getFile(req : Request, res : Response, next : NextFunction){
    try {
        let gun = req.query.gun;
        let payload : any[] = await getBayilerByGroup(gun)
        let header = Object.keys(payload[0]["bayiler"][0]);
        let _result = payload.map((altBolge : any) => {
            return addValuesToWorksheet(header, altBolge["bayiler"]);
        })
        res.json(_result)
    } catch (err) {
        next(err)
    }    
}