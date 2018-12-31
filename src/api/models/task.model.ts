import { Model, Document, Schema, DocumentQuery, model, Types } from "mongoose";
import { ITask, ITaskDocument } from "../interface";

export interface ITaskModel extends Model<ITaskDocument> {}

const taskSchema : Schema = new Schema({
    name : { type : String, required : true },
    executeTime : { type : Date, default : new Date().toLocaleString('en-US', {
        timeZone : 'Europe/Istanbul'
    }) },
    done : { type : Boolean, required : true },
    error : { type : Boolean, required : false},
    frequency : {type : Array, required : true, default : [1,2,3,4,5]}
})

taskSchema.pre<ITaskDocument>('save', function(next){
    this.error = !this.done;
    next()
})

export const Task = model<ITaskDocument, ITaskModel>("Task", taskSchema);