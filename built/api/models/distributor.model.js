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
require("../models/user.model");
const APIError = require('../utils/APIError');
const distributorSchema = new mongoose_1.Schema({
    name: { type: String, default: "TANIMSIZ" },
    status: { type: Boolean, default: true },
    users: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    kod: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    bolge: { type: String, default: "TANIMSIZ" },
    altBolge: { type: String, default: "TANIMSIZ" },
    bolgeData: [
        {
            il: {
                type: String,
                uppercase: true,
                require: true
            },
            ilce: {
                type: String,
                uppercase: true,
                require: true
            },
            altBolge: {
                type: String,
                uppercase: true,
                require: true
            }
        }
    ]
}, {
    collection: "dist",
    // toJSON : {
    //   transform : (doc, ret) => {
    //     delete ret._id
    //   }
    // },
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
distributorSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret._id;
    }
});
distributorSchema.static('getDistsIdByAdres', (adres) => __awaiter(this, void 0, void 0, function* () {
    try {
        return yield exports.Dist.find({
            bolgeData: {
                $elemMatch: {
                    il: adres.il,
                    ilce: adres.ilce
                }
            }
        }).select("_id");
    }
    catch (err) {
        throw new APIError(err);
    }
}));
exports.Dist = mongoose_1.model("Dist", distributorSchema);
