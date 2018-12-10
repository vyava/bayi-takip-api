import { NextFunction, Request, Response } from 'express';
import { getBayilerByGroup } from "../controllers/bayi.controller";
import { addValuesToWorksheet } from "../helper/excel";
import { IBayi } from 'api/interface';


export async function send(req: Request, res: Response, next: NextFunction) {
    try {
        let gun = req.query.gun;


        let payload: any[] = await getBayilerByGroup(gun);

        if(payload.length < 1) throw new Error("Bayi bulunamadı")

        // Get keys of object to set Header
        let header = Object.keys(payload[0]["bayiler"][0]);

        // Iterate each altBolge to get file
        let resultPromise = payload.map(async (bolgeData: any) => {
            return getFilePath(header, bolgeData);
        })

        Promise.all(resultPromise)
            .then(_res => {
                res.json(_res);
            })
            .catch(err => {
                next(err)
            })
    } catch (err) {
        next(err)
    }
}


export async function getFilePath(header: string[], payload: any): Promise<any> {
    try {
        return addValuesToWorksheet(header, payload["bayiler"])
    } catch (err) {
        throw err
    }
}