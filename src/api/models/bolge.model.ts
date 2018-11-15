import { Model, Document, Schema, DocumentQuery, model, Types } from "mongoose";
import { IBolgeDocument, IBolge } from "../interface";

export interface IBolgeDocumentModel extends Model<IBolgeDocument> {
    getBolge(id: number): any;
    setBolge(payload : IBolge) : any;
}

const bolgeSchema: Schema = new Schema({
    kod: { type: Number, required: true },
    name: { type: String },
    distributor: { type: Array }
}, {
        collection: "bolge"
    });

bolgeSchema.static('getBolge', (kod: number) => {
    return Bolge.find({ kod: kod });
});

bolgeSchema.static('setBolge', (payload: IBolge) => {
    return Bolge.findOneAndUpdate(
        { kod: payload.kod },
        {
            $set: {
                kod: payload.kod.toString(),
                name: payload.name,
                distributor: payload.distributor || []
            },
        },
        {
            upsert: true
        },
        (err, bolge, res) => {
            if(err) throw new Error(err);
            console.log(res);
            return Promise.resolve(bolge);
        }
    )
});

export const Bolge: IBolgeDocumentModel = model<IBolgeDocument, IBolgeDocumentModel>("Bolge", bolgeSchema);