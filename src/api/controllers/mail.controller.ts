import { NextFunction, Request, Response } from 'express';
import { getBayilerByGroup } from "../controllers/bayi.controller";
import { addValuesToWorksheet, newWorkbook, newWorksheet, saveFile } from "../helper/excel";
import { IBayi } from 'api/interface';
import { TapdkHeader } from '../helper/interface/file.interface';

const APIError = require("../utils/APIError");
import * as httpStatus from "http-status"

import * as fs from "fs"
import moment = require('moment');

const BASE_DIR = "files"

export async function send(req: Request, res: Response, next: NextFunction) {
    try {

        // Get date from request query. if null, Joi will set `DÜN` as default
        const gun = req.query.gun;

        // Get bayiler from DB by date
        let payload: any[] = await getBayilerByGroup(gun);

        // If bolge length less than 1 throw error
        if (payload.length < 1) throw new APIError({
            message : "Bayi bulunamadı",
            status : httpStatus.NO_CONTENT
        })

        // Get keys of object to set Header
        let HEADER = TapdkHeader;

        // Iterate each altBolge to get file
        let resultPromise = payload.map(async (bolgeData: any) => {

            bolgeData['bayiler'].map((bayi : any) => {
                bayi.distributor = bayi.distributor.map(obj => obj.name).join(", ")
            })
            
            // Set default options for worksheeet
            let options = {

                // Bolge name
                sheetName: bolgeData["_id"],
                views: [
                    {
                        zoomScale: 90,
                        state: 'frozen',
                        xSplit: 2,
                        ySplit: 1
                    }
                ]
            }
            // Create new Workbook
            let _workbook = newWorkbook();

            // Create new Worksheet
            let _worksheet = newWorksheet(_workbook, options);

            // Set default options to write
            let writeOptions = {
                path: getFilePath(),
                fileName: moment().format("DD-MM-YYYY")+"-"+moment().unix()+"-"+options.sheetName,
                fileExt: "xlsx"
            }

            // Insert bayiler to worksheet. Returns void. If error then throw
            addValuesToWorksheet(_worksheet, HEADER, bolgeData["bayiler"]);

            // Return saved file path
            return saveFile(_workbook, writeOptions)
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


function getFilePath() {
    if (!fs.existsSync(BASE_DIR)) {
        fs.mkdirSync(BASE_DIR);
    };

    return BASE_DIR;
}