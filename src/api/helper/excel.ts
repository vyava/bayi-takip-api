// import * as tempfile from 'tempfile';
import * as Excel from "exceljs";
const APIError = require("../utils/APIError");
import * as httpStatus from "http-status"

import * as tempfile from "tempfile";
import { IBayi } from "../../api/interface";

enum HEADER {
    altBolge = "Bölge",
    distributor = "Dist",
    createdAt = "Kayıt Tarihi",
    updatedAt = "Güncelleme Tarihi",
    ruhsatNo = "Ruhsat No",
    ruhsatTipleri = "Ruhsat Tipleri",
    adiSoyadi = "Adı-Soyadı",
    unvan = "Ünvan",
    il = "İl",
    ilce = "İlçe",
    adres = "Adres",
    sinif = "Sınıf",
    sinifDsd = "Sınıf DSD",
    durum = "Durum"
}

export function newWorkbook(options?: any) {
    try {
        let _wb = new Excel.Workbook();
        _wb.creator = "net.asstan";
        return _wb;
    } catch (err) {
        throw new APIError({
            message : "Workbook oluşturulamadı.",
            status : httpStatus.NO_CONTENT
        });
    }
}

export function newWorksheet(_wb: Excel.Workbook, options?: any) {
    let _ws = _wb.addWorksheet(options.sheetName);
    _ws.views = options.views;
    _ws.columns = [];
    return _ws;
}

export function addValuesToWorksheet(_ws: Excel.Worksheet, columns: string[], values: any[], options?: any) {
    try {
        let _column = columns.map((key: any) => {
            return {
                header: HEADER[key],
                key: key
            }
        });
        _ws.columns = _column;

        values.map((values: any, indexRow: number) => {
            let _row = _ws.getRow(indexRow+2);
            
            let keys = Object.keys(values);
            keys.map((key: any) => {
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
            })
        })
    } catch (err) {
        throw new APIError({
            message : err
        })
    }
};

export function saveFile(_wb: Excel.Workbook, options?: any) {

    let path = `${options.path}/${options.fileName}.${options.fileExt}`

    return _wb.xlsx.writeFile(path)
        .then(resolve => {
            return path
        })
        .catch(err => {
            throw new Error("Dosya yazılamadı.")
        })
}

