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
const bolge_model_1 = require("../models/bolge.model");
function getBolge(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let bolgeKod = req.query.kod || null;
        const bolge = yield bolge_model_1.Bolge.getBolge(bolgeKod);
        res.json(bolge);
    });
}
exports.getBolge = getBolge;
;
function setBolge(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let payload = req.query || null;
        const bolge = yield bolge_model_1.Bolge.setBolge(payload);
        res.json(bolge);
    });
}
exports.setBolge = setBolge;
;
