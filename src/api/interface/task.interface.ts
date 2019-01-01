import { Document, Types } from "mongoose";

export interface ITask {
    name : "TAPDK" | "MAIL";
    done : boolean;
    error : boolean;
    period : {
        year : number,
        month : number,
        days : number[];
        hour : number;
        minute : number;
    },
    params : Object
}

export interface ITaskDocument extends Document, ITask {}