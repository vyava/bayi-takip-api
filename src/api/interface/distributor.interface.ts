import { Document, Types } from "mongoose";
import { IBolge } from "./bolge.interface";
import { IUserDocument } from "./user.interface";


export interface IDistributorDocument extends Document, IDistributor { };

export interface IDistributor {
    kod            : number;
    name           : string;
    status         : boolean;
    users?         : IUserDocument[];
    bolge?         : IBolge;
    bolgeKod?      : number;
    bolgeler?      : string;
};

export interface IDistributorShort {
    bolge : string;
    bolgeler : string;
    id : number;
    name : string;
}