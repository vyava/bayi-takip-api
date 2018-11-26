import { Model, Schema, model } from "mongoose";
import { IBolgeDocument } from "../interface";

export interface IBolgeDocumentModel extends Model<IBolgeDocument> { }

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

export const Bolge: IBolgeDocumentModel = model<IBolgeDocument, IBolgeDocumentModel>("Bolge", bolgeSchema);