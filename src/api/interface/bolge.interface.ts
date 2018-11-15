import { Document } from "mongoose";


export interface IBolgeDocument extends Document, IBolge { };

export interface IBolge {
    kod           : number;
    name          : string;
    distributor?  : any[];
}