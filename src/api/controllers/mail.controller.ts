import { NextFunction, Request, Response } from 'express';
import { getBayilerByGroup } from "../controllers/bayi.controller";
import { addValuesToWorksheet, newWorkbook, newWorksheet, saveFile } from "../helper/excel";
import { IBayi } from 'api/interface';
import { TapdkHeader } from '../helper/interface/file.interface';

const APIError = require("../utils/APIError");
import * as httpStatus from "http-status"

const config = require("../../config/vars")

// import * as MailService from "@sendgrid/mail";
const MailService = require("@sendgrid/mail")

import * as _ from "lodash"

import * as fs from "fs"
import moment = require('moment');
import { IMailPayload } from 'api/interface/mail.interface';
import { MailData } from '@sendgrid/helpers/classes/mail';

const BASE_DIR = "files"
const DEFAULT_SHEETNAME = "Sayfa 1"

export async function send(req: Request, res: Response, next: NextFunction) {
    try {
        initialize()
        // Get date from request query. if null, Joi will set `DÜN` as default
        const { gun } = req.query;

        // Get bayiler from DB by date
        let data: any[] = await getBayilerByGroup(gun);

        res.send(data)

        // If bolge length less than 1 throw error
        // if (data.length < 1) throw new APIError({
        //     message: "Mail gönderimi yapılacak bayi bulunamadı."
        // })

        // // Get keys of object to set Header
        // let HEADER = TapdkHeader;
        // // Iterate each altBolge to get file
        // let resultPromise = data.map(async (bolgeData: any) => {
        //     // console.log(bolgeData)
        //     bolgeData['bayiler'].map((bayi: any) => {
        //         bayi.distributor = bayi.distributor.map(obj => obj.name).join(", ");
        //         bayi.updatedAt = moment(bayi.updatedAt).format("DD.MM.YYYY");
        //         bayi.createdAt = moment(bayi.createdAt).format("DD.MM.YYYY");
        //     })

        //     let options = {
        //         _sheetname: bolgeData['_id'],
        //         _header: HEADER
        //     }
        //     let _filePath = await getFile(bolgeData['bayiler'], options);

        //     let to = _.map(bolgeData["users"], (user) => {
        //         if (user.taskName == "operator" || user.taskName == "tte") {
        //             return user.email
        //         }
        //     });

        //     let cc = _.map(bolgeData["users"], (user) => {
        //         if (user.taskName == "dsm") {
        //             return user.email
        //         }
        //     });

        //     let mailPayload: MailData = {
        //         from: config.sender_address,
        //         attachments: [
        //             {
        //                 content: fs.readFileSync(_filePath, { encoding: "base64" }),
        //                 filename: options._sheetname
        //             }
        //         ],
        //         to: _.compact(to),
        //         cc: _.compact(cc)
        //     }

        //     return mailPayload

        // })

        // Promise.all(resultPromise)
        //     .then(_res => {
        //         res.json(_res);
        //     })
        //     .catch(err => {
        //         next(err)
        //     })

    } catch (err) {
        next(err)
    }
}

async function sendMail(payload: MailData[], options?: any) {
    payload.map(mail => {
        mail.cc = [
            {
                email: "genczafer02@gmail.com",
                name: "Zafer GENÇ"
            }
        ];
        mail.to = [
            {
                email: "zafergenc02@gmail.com",
                name: "Zafer GENÇ"
            }
        ]
    })
    MailService.send(payload);
}

function initialize() {
    MailService.setApiKey(process.env.SENDGRID_API_KEY);
}

async function getFile(data, options: any) {
    try {
        // Set default options for worksheeet
        let { _sheetname, _header } = options;

        let _options = {

            // Bolge name
            sheetName: _sheetname || DEFAULT_SHEETNAME,
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
        let _worksheet = newWorksheet(_workbook, _options);

        // Set default options to write
        let writeOptions = {
            path: getFilePath(),
            fileName: moment().format("DD-MM-YYYY") + "-" + moment().unix() + "-" + _sheetname,
            fileExt: "xlsx"
        }
        // Insert bayiler to worksheet. Returns void. If error then throw
        addValuesToWorksheet(_worksheet, _header, data);

        // Return saved file path
        return await saveFile(_workbook, writeOptions)
    } catch (err) {
        throw err
    }

}

function getFilePath() {
    if (!fs.existsSync(BASE_DIR)) {
        fs.mkdirSync(BASE_DIR);
    };

    return BASE_DIR;
}