import { Document, Types } from "mongoose";

export interface ITask {
    name : string;
    executeTime : Date;
    done : boolean;
    error : boolean;
}

export interface ITaskDocument extends Document, ITask {}