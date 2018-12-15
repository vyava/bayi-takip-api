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

    // let start : any, end : any;
    let {start, end} = {start : null, end : null}
    
    if(typeof GÜN[gun] == "string"){
        start = moment().startOf(<any>GÜN[gun]).toDate();
        end = moment().endOf(<any>GÜN[gun]).toDate();
    }else if(typeof GÜN[gun] == "number"){
        start = moment().subtract(GÜN[gun], "days").startOf("day").toDate();
        end = moment().subtract(GÜN[gun], "days").endOf("day").toDate();
    }else{
        throw new Error("Tarih aralığı istenen formatta değil.");
    }
    return {start, end};
}

export function getDateTS(gun : any = "BUGÜN"){
    var date = moment().tz("Europe/Istanbul").subtract(<any>GÜN[gun], "days").hour(7).valueOf();
    return date;
}