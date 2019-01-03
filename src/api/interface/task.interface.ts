import { Document, Types } from "mongoose";

export interface ITask {
    name : "TAPDK" | "MAIL";
    done : boolean;
    error : boolean;
    period : {
        year : number,
        month : number,
        days : number[];
        startHour : number;
        stopHour : number;
        startMinute : number;
        stopMinute : number;
    },
    params : Object,
    active : boolean,
    updatedAt : Date
}

export interface ITaskDocument extends Document, ITask {}