import { Document, Types } from "mongoose";
import { IBolge } from "./bolge.interface";
import { IUserDocument, IUser } from "./user.interface";


export interface IDistributorDocument extends Document, IDistributor { };

export interface IDistributor {
    _id            : any;
    kod            : number;
    name           : string;
    status         : boolean;
    users?         : Types.ObjectId[];
    userData?      : IUser[];
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