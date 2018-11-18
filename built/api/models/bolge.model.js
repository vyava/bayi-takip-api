"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bolgeSchema = new mongoose_1.Schema({
    kod: { type: Number, required: true },
    name: { type: String },
    distributor: { type: Array }
}, {
    collection: "bolge"
});
bolgeSchema.static('getBolge', (kod) => {
    return exports.Bolge.find({ kod: kod });
});
bolgeSchema.static('setBolge', (payload) => {
    return exports.Bolge.findOneAndUpdate({ kod: payload.kod }, {
        $set: {
            kod: payload.kod.toString(),
            name: payload.name,
            distributor: payload.distributor || []
        },
    }, {
        upsert: true
    }, (err, bolge, res) => {
        if (err)
            throw new Error(err);
        console.log(res);
        return Promise.resolve(bolge);
    });
});
exports.Bolge = mongoose_1.model("Bolge", bolgeSchema);
