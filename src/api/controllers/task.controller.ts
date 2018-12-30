import * as requestPromise from "request-promise";
import * as mongoose from "mongoose"
import * as moment from "moment";
import "../models/task.model"
import { ITaskModel } from "../models/task.model";
import { ITask, ITaskDocument } from "api/interface";

const TaskModel : ITaskModel = mongoose.model("Task");

export async function addTask(){
    let task = new TaskModel();
    // task.executeTime = Date.now();
    task.name = "Deneme";
    task.done = false;
    task.save();

    return await task;
}

export async function getTask(){
    try {
        let task : ITaskDocument[] = await TaskModel.find({
            done : false
        }).limit(1).sort({
            _id : -1
        });
        if(task.length < 1) throw new Error("Task bulunamadı")

        if(isReady(task[0])) return task[0];

        throw new Error("Task not ready");
    } catch (err) {
        throw err
    }
}

function isReady(task : ITask){
    let now = moment(new Date());
    let taskTime = moment(task.executeTime);
    console.log(now)
    console.log(taskTime)
    let {_isValid, _data} = <any>moment.duration(now.diff(taskTime));
    let {milliseconds, seconds, minutes, hours, days, months, years} = _data;
    console.log(_data)
    if(_isValid){
        if((years < 0
            && months < 0
            && days < 0
            && hours < 0
            && minutes < 2)){
                return true
            }
            return false
    }
    return false
}