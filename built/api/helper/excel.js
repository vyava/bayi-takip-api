"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as tempfile from 'tempfile';
const Excel = require("exceljs");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");
var HEADER;
(function (HEADER) {
    HEADER["altBolge"] = "B\u00F6lge";
    HEADER["distributor"] = "Dist";
    HEADER["createdAt"] = "Kay\u0131t Tarihi";
    HEADER["updatedAt"] = "G\u00FCncelleme Tarihi";
    HEADER["ruhsatNo"] = "Ruhsat No";
    HEADER["ruhsatTipleri"] = "Ruhsat Tipleri";
    HEADER["adiSoyadi"] = "Ad\u0131-Soyad\u0131";
    HEADER["unvan"] = "\u00DCnvan";
    HEADER["il"] = "\u0130l";
    HEADER["ilce"] = "\u0130l\u00E7e";
    HEADER["adres"] = "Adres";
    HEADER["sinif"] = "S\u0131n\u0131f";
    HEADER["sinifDsd"] = "S\u0131n\u0131f DSD";
    HEADER["durum"] = "Durum";
})(HEADER || (HEADER = {}));
function newWorkbook(options) {
    try {
        let _wb = new Excel.Workbook();
        _wb.creator = "net.asstan";
        return _wb;
    }
    catch (err) {
        throw new APIError({
            message: "Workbook oluşturulamadı.",
            status: httpStatus.NO_CONTENT
        });
    }
}
exports.newWorkbook = newWorkbook;
function newWorksheet(_wb, options) {
    let _ws = _wb.addWorksheet(options.sheetName);
    _ws.views = options.views;
    _ws.columns = [];
    return _ws;
}
exports.newWorksheet = newWorksheet;
function addValuesToWorksheet(_ws, columns, values, options) {
    try {
        let _column = columns.map((key) => {
            return {
                header: HEADER[key],
                key: key
            };
        });
        _ws.columns = _column;
        values.map((values, indexRow) => {
            let _row = _ws.getRow(indexRow + 2);
            let keys = Object.keys(values);
            keys.map((key) => {
                _row.getCell(key).value = {
                    'richText': [
                        {
                            font: {
                                size: 11
                            },
                            text: values[key] || ""
                        }
                    ]
                };
            });
        });
    }
    catch (err) {
        throw new APIError({
            message: err
        });
    }
}
exports.addValuesToWorksheet = addValuesToWorksheet;
;
function saveFile(_wb, options) {
    let path = `${options.path}/${options.fileName}.${options.fileExt}`;
    return _wb.xlsx.writeFile(path)
        .then(resolve => {
        return path;
    })
        .catch(err => {
        throw new Error("Dosya yazılamadı.");
    });
}
exports.saveFile = saveFile;
