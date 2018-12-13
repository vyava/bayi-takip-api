import * as moment from "moment"
process.env.TZ = 'Europe/Istanbul';
moment().tz("Europe/Istanbul");

enum GÜN {
    DÜN =1,
    BUGÜN= 0,
    AYBAŞI = "month",
    YILBAŞI = "year"
}

export function getDate(gun : any = "BUGÜN"){
    
    let start : any, end : any;
    // console.log(GÜN[gun])
    // if(<any>GÜN[gun] == 1 || <any>GÜN[gun] == 0){
        start = moment().startOf(<any>GÜN.DÜN).toDate();
        end = moment().endOf(<any>GÜN.DÜN).toDate();
    // }else if(<any>GÜN[gun] == "year" || <any>GÜN[gun] == "month"){
    //     start = moment().subtract(GÜN[gun], "days").startOf("day").toDate();
    //     end = moment().subtract(GÜN[gun], "days").endOf("day").toDate();
    // }else{
    //     throw new Error("Tarih aralığı istenen formatta değil.");
    // }
    var obj = {
        start : start,
        end : end
    }
    return obj;
}

export function getDateTS(gun : any = "BUGÜN"){
    var date = moment().tz("Europe/Istanbul").subtract(GÜN[gun], "days").hour(7).valueOf();
    return date;
}