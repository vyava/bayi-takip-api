import { Document } from "mongoose";


export interface IUserDocument extends Document, IUser { };

export interface Mail {
    address : string;
    name : string;
}

export interface IUser {
    _id : any;
    firstName : string;
    lastName : string;
    fullName : string;
    email : Mail;
    level : string;
    status : boolean;
    distributor : string;
}

export interface IDSM extends IUser {
    area : string;
    taskName : string;
    distributor : string;
}

export interface ITTE extends IUser {
    area : string;
    taskName : string;
    distributor : string;
}

export interface IOperator extends IUser {
    area : string;
    taskName : string;
    distributor : string;
}

export interface IRSM extends IUser {
    area : string[];
    taskName : string;
    distributor : string;
}