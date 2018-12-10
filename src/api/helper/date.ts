import * as moment from "moment"
process.env.TZ = 'Europe/Istanbul'

enum GÜN {
    DÜN =1,
    BUGÜN= 0
}

export function getDate(gun : any = "BUGÜN"){
    var start = moment().tz("Europe/Istanbul").subtract(GÜN[gun], "days").startOf("day").toDate();
    var end = moment().tz("Europe/Istanbul").subtract(GÜN[gun], "days").endOf("day").toDate();
    return {start, end};
}

export function getDateTS(gun : any = "BUGÜN"){
    var date = moment().tz("Europe/Istanbul").subtract(GÜN[gun], "days").hour(7).valueOf();
    return date;
}