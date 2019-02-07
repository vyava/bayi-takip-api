"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const mongoose = require("mongoose");
require("../models/bolge.model");
const httpStatus = require("http-status");
const APIError = require('../utils/APIError');
const BolgeModel = mongoose.model("Bolge");
function getBolgeById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let bolgeKod = req.query.kod || null;
            const bolge = yield BolgeModel.find({
                bolgeKod: bolgeKod
            });
            if (_.isEmpty(bolge))
                throw new APIError({
                    message: "Bölge bulunamadı",
                    status: httpStatus.NOT_FOUND
                });
            res.json(bolge);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getBolgeById = getBolgeById;
;
// export async function getDistsByBolge(req: Request, res: Response, next: NextFunction) {
//     try {
//         let payload: IBolge = req.query || null
//         let dists = await BolgeModel.find({ kod: req.body.kod });
//         if (_.isEmpty(dists) && dists.length == 0) throw new APIError({
//             message: "Bölge bulunamadı",
//             status: httpStatus.NOT_FOUND
//         });
//         res.json(dists);
//     } catch (err) {
//         next(err)
//     }
// };
