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
const _ = require("lodash");
const exceljs_1 = require("exceljs");
const path = require("path");
exceljs_1.config.setValue('promise', require("bluebird"));
var HEADER;
(function (HEADER) {
    HEADER[HEADER["bolge"] = 1] = "bolge";
    HEADER[HEADER["altBolge"] = 2] = "altBolge";
    HEADER[HEADER["bolgeKod"] = 3] = "bolgeKod";
    HEADER[HEADER["distributor"] = 4] = "distributor";
    HEADER[HEADER["kod"] = 5] = "kod";
    HEADER[HEADER["dsm"] = 6] = "dsm";
    HEADER[HEADER["tte"] = 7] = "tte";
    HEADER[HEADER["operator"] = 8] = "operator";
    HEADER[HEADER["bolgeSehir"] = 9] = "bolgeSehir";
})(HEADER || (HEADER = {}));
function parseData(row) {
    let data = {};
    data['users'] = [];
    data['userData'] = [];
    data['bolgeData'] = [];
    row.eachCell((cell, cellIndex) => {
        switch (cellIndex) {
            case HEADER.bolge:
                data['bolge'] = cell.value;
                break;
            case HEADER.altBolge:
                data['altBolge'] = cell.value;
                break;
            case HEADER.bolgeKod:
                data['bolgeKod'] = cell.value;
                break;
            case HEADER.distributor:
                data['name'] = cell.value;
                break;
            case HEADER.kod:
                data['kod'] = cell.value;
                break;
            case HEADER.dsm:
                _.compact(cell.value.split(",")).map((v) => {
                    let _v = _.trim(v);
                    let result = parseEmail(_v, "dsm");
                    data['userData'].push(result);
                });
                break;
            case HEADER.tte:
                _.compact(cell.value.split(",")).map((v) => {
                    let _v = _.trim(v);
                    let result = parseEmail(_v, "tte");
                    data['userData'].push(result);
                });
                break;
            case HEADER.operator:
                cell.value.split(",").map((v) => {
                    let _v = _.trim(v);
                    let result = parseEmail(_v, "operator");
                    data['userData'].push(result);
                });
                break;
            case HEADER.bolgeSehir:
                let val = _.compact(cell.value.split(";").map(_.trim));
                let result = [];
                val.map((v, i) => {
                    let _v = v.split("=");
                    if (_v.length == 1 || _v.length == 0) {
                        result.push({
                            il: _v[0] || null
                        });
                    }
                    else {
                        _.compact(_v[1].split(",")).map((ilce) => {
                            result.push({
                                il: _v[0],
                                ilce: _.trim(ilce),
                                altBolge: data['altBolge']
                            });
                        });
                    }
                });
                data['bolgeData'] = result;
                break;
            default:
                break;
        }
    });
    return data;
}
function parseEmail(data, taskName) {
    let _data = data.toString();
    try {
        let matchedData = {};
        _data.replace(/(.*?)<\s?(\S+@\S+)\s?>/g, function (m, p1, p2) {
            matchedData['email'] = {
                name: _.trim(p1),
                address: _.trim(p2)
            };
            matchedData['name'] = _.trim(p1);
            matchedData['taskName'] = taskName ? taskName : null;
            return m;
        });
        return matchedData;
    }
    catch (err) {
        throw err;
    }
}
exports.parseEmail = parseEmail;
function readExcelFile() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let filePath = path.join(__dirname, "file.xlsx");
            const workbook = new exceljs_1.Workbook();
            let distData = yield workbook.xlsx.readFile(filePath)
                .then(_wb => {
                let sheet = _wb.getWorksheet(1);
                let data = [];
                sheet.eachRow((row, rowIndex) => {
                    if (rowIndex != 1) {
                        // let _values = _.compact(row.values);
                        data.push(parseData(row));
                        // header.push(HEADER[index]);
                    }
                });
                // let row : any = sheet.getRow(1).values;
                // row =  _.compact(row)
                // row = row.map( (val : string) => val.replace(/ /g, "_"));
                // let header = row.map((val : any) => {
                //     return HEADER[val]
                // });
                // let array : any[] = []
                // let _vals : any = sheet.getRow(2).values;
                // _vals.map((v : any, index : number) => {
                //     array.push({
                //         [header[index-1]] : _vals[index]
                //     })
                // });
                return data;
            })
                .catch(err => {
                throw err;
            });
            return distData;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.readExcelFile = readExcelFile;
