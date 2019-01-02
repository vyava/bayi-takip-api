import * as requestPromise from "request-promise";
import * as mongoose from "mongoose"
import * as moment from "moment";
import "../models/task.model"
import { ITaskModel } from "../models/task.model";
import { ITask, ITaskDocument } from "api/interface";
import { Request, Response, NextFunction } from "express";

import { getSource } from "../controllers/tapdk.controller";

const TaskHandlers = {
    TAPDK : getSource
}

const TaskModel : ITaskModel = mongoose.model("Task");

export async function addTask(){
    let task = new TaskModel();
    task.name = "TAPDK";
    task.done = false;
    task.active = true;
    task.period.startHour = 8;
    task.period.stopHour = 20;
    task.period.startMinute = 0;
    task.period.stopMinute = 60;
    task.save();

    return await task;
}

export async function getTask(req : Request, res : Response, next : NextFunction){
    try {
        let {_day, _hour, _minute} = getDateParsed()
        let task : ITaskDocument[] = await TaskModel.find({
            active : true,
            "period.days" : {
                $eq : _day
            },
            "period.startHour" : {
                $lte : _hour
            },
            "period.stopHour" : {
                $gte : _hour
            },
            "period.startMinute" : {
                $lte : _minute
            },
            "period.stopMinute" : {
                $gte : _minute
            }
        }).limit(1).sort({
            _id : -1
        });
        if(task.length < 1) throw new Error("Task bulunamadı");
        // if(isReady(task[0])){
        req.body = {
            param :task[0].params,
            taskId : task[0]._id
        };
        // task[0].active = false;
        // await task[0].save();
        
        // res.json(task[0]);
        let taskName = task[0].name;
        TaskHandlers["TAPDK"](req, res, next);

        //     return task[0];
        // }else{
        //     throw new Error("Task not ready");
        // }
        
    } catch (err) {
        next(err)
    }
}

export async function findTaskById(taskId : mongoose.Types.ObjectId){
    return await TaskModel.findById(taskId);
}

function getDateParsed(){
    let now = moment().toDate();
    let _hour = now.getHours();
    let _minute = now.getMinutes();
    let _day = now.getDay();
    return {_day, _hour, _minute}
}

// function isReady(task : ITask){
//     let now = moment(new Date());
//     let {hour, minute } = task.period;
//     let taskTime = moment().hour(hour).minute(minute);
    

//     let {_data} = <any>moment.duration(now.diff(taskTime));
//     let {minutes, hours } = _data;

//     if((hours == 0 && minutes == 0)) return true
//     return false
// }