"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const request_1 = require("./interface/request");
process.env.TZ = 'Europe/Istanbul';
moment().tz("Europe/Istanbul");
var GÜN;
(function (GÜN) {
    GÜN[GÜN["D\u00DCN"] = 1] = "D\u00DCN";
    GÜN[GÜN["BUG\u00DCN"] = 0] = "BUG\u00DCN";
    GÜN["HAFTABA\u015EI"] = "week";
    GÜN["AYBA\u015EI"] = "month";
    GÜN["YILBA\u015EI"] = "year";
})(GÜN || (GÜN = {}));
function getDate(gun = "BUGÜN", type) {
    if (type == "tapdk") {
        return request_1.TARIH[gun];
    }
    // let start : any, end : any;
    let { start, end } = { start: null, end: null };
    if (typeof GÜN[gun] == "string") {
        start = moment().startOf(GÜN[gun]).toDate();
        end = moment().endOf(GÜN[gun]).toDate();
    }
    else if (typeof GÜN[gun] == "number") {
        start = moment().subtract(GÜN[gun], "days").startOf("day").toDate();
        end = moment().subtract(GÜN[gun], "days").endOf("day").toDate();
    }
    else {
        throw new Error("Tarih aralığı istenen formatta değil.");
    }
    return { start, end };
}
exports.getDate = getDate;
// export function getDateTS(gun : any = "BUGÜN"){
//     var date = moment().tz("Europe/Istanbul").subtract(<any>GÜN[gun], "days").hour(7).valueOf();
//     return date;
// }
