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
    altBolge?         : IBolge;
    bolgeKod?      : number;
    bolge?      : string;
};

export interface IDistributorShort {
    altBolge : string;
    bolge : string;
    id : number;
    name : string;
}