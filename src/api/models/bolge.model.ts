import { Model, Document, Schema, DocumentQuery, model, Types } from "mongoose";
import { IBolgeDocument, IBolge, DistRequest, IIlce } from "../interface";

export interface IBolgeDocumentModel extends Model<IBolgeDocument> {
    getBolge(il: string): any;
    getDistsByAdres(adres: DistRequest): any;
    setBolge(payload: IBolge): any;
    getDistsByIl(il : string) : any;
}

const bolgeSchema: Schema = new Schema({
    il: { type: String },
    ilce: { type : Array}
}, {
        collection: "bolge"
    });

bolgeSchema.static('getDistsByAdres', (adres: DistRequest) => {
    return Bolge.findOne(
        {
            "il" : adres.il,
        },
        {
            "ilce" : {
                $elemMatch : {
                    name : adres.ilce
                }
            }
        }
    );
});

bolgeSchema.static('getDistsByIl', (il: string) => {
    return Bolge.findOne(
        {
            "il" : il,
        },
    );
});

bolgeSchema.static('getBolge', (il: string) => {
    return Bolge.find({});
});
// bolgeSchema.static('setBolge', (payload: IBolge) => {
//     return Bolge.findOneAndUpdate(
//         { il: payload.il },
//         {
//             $set: {
//                 kod: payload.kod.toString(),
//                 il: payload.il,
//                 distributor: payload.distributor || []
//             },
//         },
//         {
//             upsert: true
//         },
//         (err, bolge, res) => {
//             if (err) throw new Error(err);
//             console.log(res);
//             return Promise.resolve(bolge);
//         }
//     )
// });

export const Bolge: IBolgeDocumentModel = model<IBolgeDocument, IBolgeDocumentModel>("Bolge", bolgeSchema);