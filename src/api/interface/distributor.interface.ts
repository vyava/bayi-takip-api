import { Document } from "mongoose";
import { IBolgeDocument } from "./bolge.interface";


export interface IDistributorDocument extends Document, IDistributor { };

export interface IDistributor {
    kod            : number;
    name           : string;
    status         : boolean;
    dsm?           : any[];
    tte?           : any[];
    operator?      : any[];
    scope?         : any[];
    bolge?         : IBolgeDocument;
}