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
const mongoose_1 = require("mongoose");
// const httpStatus = require('http-status');
const httpStatus = require("http-status");
const APIError = require('../utils/APIError');
const distributorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    status: { type: Boolean, default: true },
    dsm: { type: String },
    tte: { type: String },
    operator: { type: String },
    scope: { type: String },
    bolge: { type: String, required: true }
}, { collection: "distributor" });
distributorSchema.static('getDistById', (id) => __awaiter(this, void 0, void 0, function* () {
    try {
        let dist = yield exports.Dist.findOne({ id: id });
        if (!dist)
            throw new APIError({
                message: "Distributor bulunamadı",
                status: httpStatus.NOT_FOUND
            });
        return dist;
    }
    catch (err) {
        throw new APIError(err);
    }
}));
distributorSchema.static('setDist', (payload) => __awaiter(this, void 0, void 0, function* () {
    try {
        let dist = new exports.Dist(payload);
        let result = yield dist.save();
        return result;
    }
    catch (err) {
        throw new APIError(err);
    }
}));
exports.Dist = mongoose_1.model("Dist", distributorSchema);
