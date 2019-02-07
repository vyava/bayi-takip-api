"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bayi_controller_1 = require("../controllers/bayi.controller");
const excel_1 = require("../helper/excel");
const file_interface_1 = require("../helper/interface/file.interface");
const APIError = require("../utils/APIError");
const config = require("../../config/vars");
const MailService = require("@sendgrid/mail");
// const MailService = require("@sendgrid/mail")
const _ = require("lodash");
const fs = require("fs");
const moment = require("moment");
const template_controller_1 = require("./template.controller");
const byte_1 = require("../helper/byte");
const BASE_DIR = "files";
const DEFAULT_SHEETNAME = "Sayfa 1";
function send(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            initialize();
            // Get date from request query. if null, Joi will set `DÜN` as default
            const { gun } = req.query;
            // Get bayiler from DB by date
            let data = yield bayi_controller_1.getBayilerByGroup(gun);
            // res.send(data)
            // If bolge length less than 1 throw error
            if (data.length < 1)
                throw new APIError({
                    message: "Mail gönderimi yapılacak bayi bulunamadı."
                });
            // // Get keys of object to set Header
            let HEADER = file_interface_1.TapdkHeader;
            // // Iterate each altBolge to get file
            let resultPromises = data.map((bolgeData) => __awaiter(this, void 0, void 0, function* () {
                bolgeData["data"] = [];
                bolgeData['bayiler'].map((bayi) => {
                    bayi.distributor = bayi.distributor.map(obj => {
                        // FAAL, ONAY VE TERK bayi sayılarını distributor bazında sayar
                        let found = _.find(bolgeData["data"], o => {
                            return (o.distributor == obj.name);
                        });
                        if (found) {
                            found[bayi.durum] = (found[bayi.durum] + 1) || 1;
                        }
                        else {
                            bolgeData["data"].push({
                                bolge: bayi.altBolge,
                                distributor: obj.name,
                                [bayi.durum]: 1
                            });
                        }
                        return obj.name;
                    }).join(", ");
                    bayi.updatedAt = moment(bayi.updatedAt).format("DD.MM.YYYY");
                    bayi.createdAt = moment(bayi.createdAt).format("DD.MM.YYYY");
                });
                let options = {
                    _sheetname: bolgeData['_id'],
                    _header: HEADER
                };
                let _filePath = yield getFile(bolgeData['bayiler'], options);
                let to = _.map(bolgeData["users"], (user) => {
                    if (user.taskName == "operator" || user.taskName == "tte") {
                        return user.email;
                    }
                });
                let cc = _.map(bolgeData["users"], (user) => {
                    if (user.taskName == "dsm") {
                        return user.email;
                    }
                });
                let htmlData = yield template_controller_1.getTemplate("YENI_BAYI", bolgeData["data"]);
                let mailPayload = {
                    subject: "TAPDK",
                    from: config.sender_address,
                    attachments: [
                        {
                            content: fs.readFileSync(_filePath, { encoding: "base64" }),
                            filename: options._sheetname + ".xlsx"
                        }
                    ],
                    // to: _.compact(to),
                    // cc: _.compact(cc),
                    to: [{
                            name: "Zafer GENÇ",
                            email: "zafergenc02@gmail.com"
                        }],
                    html: htmlData
                };
                return mailPayload;
            }));
            let payloadResult = yield executeAllPromises(resultPromises);
            console.log(byte_1.memorySizeOf(payloadResult));
            let mailResult = yield sendMail(payloadResult.results);
            res.json(mailResult);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.send = send;
;
function executeAllPromises(promises) {
    // Wrap all Promises in a Promise that will always "resolve"
    var resolvingPromises = promises.map(function (promise) {
        return new Promise(function (resolve) {
            var payload = new Array(2);
            promise.then(function (result) {
                payload[0] = result;
            })
                .catch(function (error) {
                payload[1] = error;
            })
                .then(function () {
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
        .then(function (items) {
        items.forEach(function (payload) {
            if (payload[1]) {
                errors.push(payload[1]);
            }
            else {
                results.push(payload[0]);
            }
        });
        return {
            errors: errors,
            results: results
        };
    });
}
function sendMail(payload, options) {
    return __awaiter(this, void 0, void 0, function* () {
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
        return yield MailService.send(payload);
    });
}
function initialize() {
    MailService.setApiKey(process.env.SENDGRID_API_KEY);
}
function getFile(data, options) {
    return __awaiter(this, void 0, void 0, function* () {
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
            };
            // Create new Workbook
            let _workbook = excel_1.newWorkbook();
            // Create new Worksheet
            let _worksheet = excel_1.newWorksheet(_workbook, _options);
            // Set default options to write
            let writeOptions = {
                path: getFilePath(),
                fileName: moment().format("DD-MM-YYYY") + "-" + moment().unix() + "-" + _sheetname,
                fileExt: "xlsx"
            };
            // Insert bayiler to worksheet. Returns void. If error then throw
            excel_1.addValuesToWorksheet(_worksheet, _header, data);
            // Return saved file path
            return yield excel_1.saveFile(_workbook, writeOptions);
        }
        catch (err) {
            throw err;
        }
    });
}
function getFilePath() {
    if (!fs.existsSync(BASE_DIR)) {
        fs.mkdirSync(BASE_DIR);
    }
    ;
    return BASE_DIR;
}
