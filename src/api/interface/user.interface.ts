import { Document, Types } from "mongoose";


export interface IUserDocument extends Document, IUser { };

export interface Mail {
    address : string;
    name : string;
}

export interface IUserPayload {
    email : Mail;
    taskName : string;
}

export interface IUser {
    _id : any;
    name : string;
    email : Mail;
    taskName : string;
    status : boolean;
    distributor? : Types.ObjectId;
}

// export interface IDSM extends IUser {
//     area : string;
//     taskName : string;
//     distributor : string;
// }

// export interface ITTE extends IUser {
//     area : string;
//     taskName : string;
//     distributor : string;
// }

// export interface IOperator extends IUser {
//     area : string;
//     taskName : string;
//     distributor : string;
// }

// export interface IRSM extends IUser {
//     area : string[];
//     taskName : string;
//     distributor : string;
// }