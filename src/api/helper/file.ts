import * as _ from "lodash";
import { Workbook, Worksheet, config, Cell, Row } from "exceljs";
const path = require("path")

config.setValue('promise', require("bluebird"));

enum HEADER {
    bolge = 1,
    altBolge,
    bolgeKod,
    distributor,
    kod,
    dsm,
    tte,
    operator,
    bolgeSehir
}

function parseData(row: Row) {

    let data: any = {}
    data['users'] = []
    data['userData'] = []
    data['bolgeData'] = []

    row.eachCell((cell: any, cellIndex) => {
        switch (cellIndex) {
            case HEADER.bolge:
                data['bolge'] = cell.value;
                break
            case HEADER.altBolge:
                data['altBolge'] = cell.value;
                break
            case HEADER.bolgeKod:
                data['bolgeKod'] = cell.value;
                break
            case HEADER.distributor:
                data['name'] = cell.value;
                break
            case HEADER.kod:
                data['kod'] = cell.value;
                break
            case HEADER.dsm:
                cell.value.split(",").map((v: any) => {
                    let _v = _.trim(v);
                    let matchedData: any = {}
                    _v.replace(/(.*?)<(\S+@\S+)>/g, function (m, p1, p2) {
                        matchedData['email'] = {
                            name : p1,
                            address : p2
                        };
                        matchedData['name'] = p1;
                        matchedData['taskName'] = "dsm"
                        return m
                    })
                    data['userData'].push(matchedData)
                })
                break;
            case HEADER.tte:
                cell.value.split(",").map((v: any) => {
                    let _v = _.trim(v);
                    let matchedData: any = {}
                    _v.replace(/(.*?)<(\S+@\S+)>/g, function (m, p1, p2) {
                        matchedData['email'] = {
                            name : p1,
                            address : p2
                        };
                        matchedData['name'] = p1;
                        matchedData['taskName'] = "tte"
                        return m
                    })
                    data['userData'].push(matchedData)
                })
                break;
            case HEADER.operator:
                cell.value.split(",").map((v: any) => {
                    let _v = _.trim(v);
                    let matchedData: any = {}
                    _v.replace(/(.*?)<(\S+@\S+)>/g, function (m, p1, p2) {
                        matchedData['email'] = {
                            name : p1,
                            address : p2
                        };
                        matchedData['name'] = p1;
                        matchedData['taskName'] = "operator"
                        return m
                    })
                    data['userData'].push(matchedData)
                })
                break;
            case HEADER.bolgeSehir:
                let val : [] = cell.value.split(";").map(_.trim);
                let result : any = []
                val.map((v : any, i : number) => {
                    let _v : any[] = v.split("=");
                    console.log(_v)
                    if(_v.length == 1 || _v.length == 0){
                        result.push({
                            il : _v[0] || null
                        })
                    }else{
                        _v[1].split(",").map((ilce : string) => {
                            result.push({
                                il : _v[0],
                                ilce : _.trim(ilce)
                            })
                        });
                    }
                    
                })

                // data['sehir'] = (!_.isArray(data['sehir'])) ? [] : data['sehir'];
                data['bolgeData'] = result;
                break;
            default:
                break;
        }
    });

    return data;
}

export async function readExcelFile() {
    try {
        let filePath = path.join(__dirname, "file.xlsx");
        const workbook = new Workbook();
        let distData = await workbook.xlsx.readFile(filePath)
            .then(_wb => {
                let sheet = _wb.getWorksheet(1);
                let data : any[] = [];
                sheet.eachRow((row, rowIndex) => {
                    if (rowIndex != 1) {
                        // let _values = _.compact(row.values);
                        data.push(parseData(row))

                        // header.push(HEADER[index]);
                    }
                })
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
                throw err
            });
        return distData;

    } catch (err) {
        throw err
    }

}

