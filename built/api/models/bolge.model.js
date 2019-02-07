"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bolgeSchema = new mongoose_1.Schema({
    il: { type: String },
    ilce: { type: Array },
    bolge: { type: String, default: "TANIMSIZ" },
    altBolge: {
        type: String,
        default: "TANIMSIZ"
    },
    bolgeKod: {
        type: Number,
        default: 0
    }
}, {
    collection: "bolge",
    toJSON: {
        transform: (doc, ret) => {
            delete ret._id;
        }
    }
});
exports.Bolge = mongoose_1.model("Bolge", bolgeSchema);
