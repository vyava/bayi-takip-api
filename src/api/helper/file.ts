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
            _.compact(cell.value.split(",")).map((v: any) => {
                    let _v = _.trim(v);
                    let result = parseEmail(_v, "dsm")
                    
                    data['userData'].push(result)
                })
                break;
            case HEADER.tte:
                _.compact(cell.value.split(",")).map((v: any) => {
                    let _v = _.trim(v);
                    let result = parseEmail(_v, "tte")
                    
                    data['userData'].push(result)
                })
                break;
            case HEADER.operator:
                cell.value.split(",").map((v: any) => {
                    let _v = _.trim(v);
                    let result = parseEmail(_v, "operator")
                    
                    data['userData'].push(result)
                })
                break;
            case HEADER.bolgeSehir:
                let val : any[] = _.compact(cell.value.split(";").map(_.trim));
                let result : any = []
                val.map((v : any, i : number) => {
                    let _v : any[] = v.split("=");
                    if(_v.length == 1 || _v.length == 0){
                        result.push({
                            il : _v[0] || null
                        })
                    }else{
                        _.compact(_v[1].split(",")).map((ilce : string) => {
                            result.push({
                                il : _v[0],
                                ilce : _.trim(ilce),
                                altBolge : data['altBolge']
                            })
                        });
                    }
                    
                })
                data['bolgeData'] = result;
                break;
            default:
                break;
        }
    });

    return data;
}

interface IMailData  {
    email : {
        name : string,
        address : string
    },
    name : string,
    taskName : string
}
export function parseEmail(data : string, taskName? : string) : any{
    let _data = data.toString();
    try {
        let matchedData : any = {};
        _data.replace(/(.*?)<\s?(\S+@\S+)\s?>/g, function (m, p1, p2) {
            matchedData['email'] = {
                name : _.trim(p1),
                address : _.trim(p2)
            };
            matchedData['name'] = _.trim(p1);
            matchedData['taskName'] = taskName ? taskName : null
            return m
        });
        return matchedData;
    } catch (err) {
        throw err
    }
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

