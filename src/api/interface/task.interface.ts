import { Document, Types } from "mongoose";

export interface ITask {
    name : string;
    executeTime : any;
    done : boolean;
    error : boolean;
}

export interface ITaskDocument extends Document, ITask {}