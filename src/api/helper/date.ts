import * as moment from "moment"
process.env.TZ = 'Europe/Istanbul'

enum GÜN {
    DÜN =1,
    BUGÜN= 0
}

export function getDate(gun : any = "BUGÜN"){
    var date = moment().tz("Europe/Istanbul").subtract(GÜN[gun], "days").hour(7).toDate();
    return date;
}

export function getDateTS(gun : any = "BUGÜN"){
    var date = moment().tz("Europe/Istanbul").subtract(GÜN[gun], "days").hour(7).valueOf();
    return date;
}