import * as moment from "moment"
import { TARIH } from "./interface/request";
process.env.TZ = 'Europe/Istanbul';
moment().tz("Europe/Istanbul");

enum GÜN {
    DÜN =1,
    BUGÜN= 0,
    HAFTABAŞI = "week",
    AYBAŞI = "month",
    YILBAŞI = "year"
}


export function getDate(gun : any = "BUGÜN", type? : string) : any{
    if(type == "tapdk"){
        return TARIH[gun]
    }

    let start : any, end : any;
    
    if(<any>GÜN[gun] == "year" || <any>GÜN[gun] == "month" || <any>GÜN[gun] == "week"){
        start = moment().startOf(<any>GÜN[gun]).toDate();
        end = moment().endOf(<any>GÜN[gun]).toDate();
    }else if(<any>GÜN[gun] == 1 || <any>GÜN[gun] == 0){
        start = moment().subtract(GÜN[gun], "days").startOf("day").toDate();
        end = moment().subtract(GÜN[gun], "days").endOf("day").toDate();
    }else{
        throw new Error("Tarih aralığı istenen formatta değil.");
    }
    return {start, end};
}

export function getDateTS(gun : any = "BUGÜN"){
    var date = moment().tz("Europe/Istanbul").subtract(GÜN[gun], "days").hour(7).valueOf();
    return date;
}