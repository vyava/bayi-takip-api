import { Model, Document, Schema, DocumentQuery, model, Types } from "mongoose";
import { IBolgeDocument, IBolge, DistRequest, IIlce, IDistributor } from "../interface";

export interface IBolgeDocumentModel extends Model<IBolgeDocument> {
    getBolge(il: string): any;
    getDistsByAdres(adres: DistRequest): any;
    setBolge(payload: IBolge): any;
    getDistsByIl(il : string) : any;
    getDistsByBolge(bolgeName : string) : IDistributor[]
}

const bolgeSchema: Schema = new Schema({
    il: { type: String },
    ilce: { type : Array},
    bolge : {
        type : String,
        default : "TANIMSIZ"
    },
    bolgeKod : {
        type : Number,
        default : 0
    }
}, {
        collection: "bolge",
        toJSON : {
            transform : (doc, ret) => {
              delete ret._id
            }
          }
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

bolgeSchema.static('getDistsByBolge', (bolgeName: string) => {
    return Bolge.find(
        {
            "bolge" : bolgeName,
        }
    ).sort("bolgeKod")
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