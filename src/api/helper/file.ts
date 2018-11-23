import * as _ from "lodash";
import {Workbook, Worksheet, config } from "exceljs";
const path = require("path")

config.setValue('promise', require("bluebird"));

enum HEADER {
    NO = "No",
    İl_Adı = "il",
    İlçe_Adı = "ilce",
    Sicil_No = "ruhsatNo",
    Adi = "adi",
    Soyadı = "adi",
    SATIŞ_YERİNİN_UNVANI = "unvan",
    SATICI_SINIFI = "sinif",
    İŞ_ADRESİ = "adres",
    DURUMU = "durum",
    AÇIKLAMA = "aciklama"
}

export async function readExcelFile(){
    let filePath = path.join(__dirname, "file.xlsx");
    const workbook = new Workbook();
    let count =  await workbook.xlsx.readFile(filePath)
        .then(_wb => {
            let sheet =  _wb.getWorksheet(1);
            let row : any = sheet.getRow(1).values;
            row =  _.compact(row)
            row = row.map( (val : string) => val.replace(/ /g, "_"));
            let header = row.map((val : any) => {
                return HEADER[val]
            });
            let array : any[] = []
            let _vals : any = sheet.getRow(2).values;
            _vals.map((v : any, index : number) => {
                array.push({
                    [header[index-1]] : _vals[index]
                })
            });
            return array;
        })
        .catch(err => {
            throw err
        });
    return count;
}

