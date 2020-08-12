import { NextFunction, Request, Response } from 'express';
import { getBayilerByGroup } from "../controllers/bayi.controller";
import { addValuesToWorksheet, newWorkbook, newWorksheet, saveFile } from "../helper/excel";
import { IBayi } from '../../api/interface';
import { TapdkHeader } from '../helper/interface/file.interface';

const APIError = require("../utils/APIError");
import * as httpStatus from "http-status"

const config = require("../../config/vars")

import * as MailService from "@sendgrid/mail";
// const MailService = require("@sendgrid/mail")

import * as _ from "lodash"

import * as fs from "fs"
import moment = require('moment');
import { IMailPayload, IBolgeMailData } from '../../api/interface/mail.interface';
import { MailData } from '@sendgrid/helpers/classes/mail';
import { getTemplate } from './template.controller';
import { memorySizeOf } from '../helper/byte';

const BASE_DIR = "files"
const DEFAULT_SHEETNAME = "Sayfa 1"

export async function send(req: Request, res: Response, next: NextFunction) {
    try {
        initialize()
        // Get date from request query. if null, Joi will set `DÜN` as default
        const { gun } = <any>req.query;

        // Get bayiler from DB by date
        let data: IBolgeMailData[] = await getBayilerByGroup(gun);
        
        
        // res.send(data)

        // If bolge length less than 1 throw error
        if (data.length < 1) throw new APIError({
            message: "Mail gönderimi yapılacak bayi bulunamadı."
        })

        // // Get keys of object to set Header
        let HEADER = TapdkHeader;
        // // Iterate each altBolge to get file
        let resultPromises = data.map(async (bolgeData) => {
            bolgeData["data"] = [];
            bolgeData['bayiler'].map((bayi : any) => {

                bayi.distributor = bayi.distributor.map(obj => {
                    // FAAL, ONAY VE TERK bayi sayılarını distributor bazında sayar
                    let found = _.find(bolgeData["data"], o => {
                        return (o.distributor == obj.name)
                    })

                    if(found){
                        found[bayi.durum] = (found[bayi.durum]+1) || 1
                    }else{
                        bolgeData["data"].push({
                            bolge : bayi.altBolge,
                            distributor : obj.name,
                            [bayi.durum] : 1
                        })
                    }

                    return obj.name
                }).join(", ");
                bayi.updatedAt = moment(bayi.updatedAt).format("DD.MM.YYYY");
                bayi.createdAt = moment(bayi.createdAt).format("DD.MM.YYYY");
            })

            let options = {
                _sheetname: bolgeData['_id'],
                _header: HEADER
            }
            let _filePath = await getFile(bolgeData['bayiler'], options);

            let to = _.map(bolgeData["users"], (user) => {
                if (user.taskName == "operator" || user.taskName == "tte") {
                    return user.email
                }
            });

            let cc = _.map(bolgeData["users"], (user) => {
                if (user.taskName == "dsm") {
                    return user.email
                }
            });

            let htmlData = await getTemplate("YENI_BAYI", bolgeData["data"]);

            let mailPayload: MailData = {
                subject : "TAPDK",
                from: config.sender_address,
                attachments: [
                    {
                        content: fs.readFileSync(_filePath, { encoding: "base64" }),
                        filename: options._sheetname+".xlsx"
                    }
                ],
                // to: _.compact(to),
                // cc: _.compact(cc),
                to : [{
                    name : "Zafer GENÇ",
                    email : "zafergenc02@gmail.com"
                }],
                html : htmlData
            }

            return mailPayload

        });
        
        let payloadResult = await executeAllPromises(resultPromises);
        console.log(memorySizeOf(payloadResult))
        let mailResult = await sendMail(payloadResult.results)
        res.json(mailResult)

    } catch (err) {
        next(err)
    }
};


function executeAllPromises(promises) {
    // Wrap all Promises in a Promise that will always "resolve"
    var resolvingPromises = promises.map(function(promise) {
      return new Promise(function(resolve) {
        var payload = new Array(2);
        promise.then(function(result) {
            payload[0] = result;
          })
          .catch(function(error) {
            payload[1] = error;
          })
          .then(function() {
            /* 
             * The wrapped Promise returns an array:
             * The first position in the array holds the result (if any)
             * The second position in the array holds the error (if any)
             */
            resolve(payload);
          });
      });
    });
  
    var errors = [];
    var results = [];
  
    // Execute all wrapped Promises
    return Promise.all(resolvingPromises)
      .then(function(items) {
        items.forEach(function(payload) {
          if (payload[1]) {
            errors.push(payload[1]);
          } else {
            results.push(payload[0]);
          }
        });
  
        return {
          errors: errors,
          results: results
        };
      });
  }

async function sendMail(payload: MailData[], options?: any) {
    // payload.map(mail => {
    //     mail.cc = [
    //         {
    //             email: "genczafer02@gmail.com",
    //             name: "Zafer GENÇ"
    //         }
    //     ];
    //     mail.to = [
    //         {
    //             email: "zafergenc02@gmail.com",
    //             name: "Zafer GENÇ"
    //         }
    //     ]
    // })
    return await MailService.send(<any>payload);
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