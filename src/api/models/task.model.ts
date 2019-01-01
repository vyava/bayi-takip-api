import { Model, Document, Schema, DocumentQuery, model, Types } from "mongoose";
import { ITask, ITaskDocument } from "../interface";
import { number } from "joi";

export interface ITaskModel extends Model<ITaskDocument> {}

const taskSchema : Schema = new Schema({
    name : { type : String, required : true },
    updatedAt : { type : Date, default : new Date().toLocaleString('en-US', {
        timeZone : 'Europe/Istanbul'
    }) },
    done : { type : Boolean, required : true },
    error : { type : Boolean, required : false},
    period : {
        year : { type : Number, default : new Date().getFullYear() },
        month : { type : Number, default : new Date().getMonth()+1 },
        days : {type : Array, default : [1,2,3,4,5]},
        hour : { type : Number, required : true },
        minute : { type : Number, required : true }
    },
    params : {
        gun : {
            type : String,
            default : "BUGÜN"
        }
    }
})

taskSchema.pre<ITaskDocument>('save', function(next){
    this.error = !this.done;
    next()
})

export const Task = model<ITaskDocument, ITaskModel>("Task", taskSchema);