import { Document } from "mongoose";
import { IDistributorShort } from "./distributor.interface";


export interface IBolgeDocument extends Document, IBolge { };

export interface IBolge {
    il           : string;
    ilce?        : IIlce[];
}

export interface IIlce {
    name : string;
    distributor : IDistributorShort[]
}