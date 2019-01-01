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

// export async function addTask(){
//     let task = new TaskModel();
//     task.name = "TAPDK";
//     task.done = false;
//     task.period.hour = 15;
//     task.period.minute = 44;
//     task.save();

//     return await task;
// }

export async function getTask(req : Request, res : Response, next : NextFunction){
    try {
        let dayOfWeek = moment().day();
        let task : ITaskDocument[] = await TaskModel.find({
            done : false,
            // "period.days" : {
            //     $eq : dayOfWeek
            // }
        }).limit(1).sort({
            _id : -1
        });
        res.json(task[0])
        // if(task.length < 1) throw new Error("Task bulunamadı")
        // if(isReady(task[0])){

        //     req.body = task[0].params;
        //     console.log(task[0].params)
        //     TaskHandlers[task[0].name](req, res, next)
        //     return task[0];
        // }else{
        //     throw new Error("Task not ready");
        // }
        
    } catch (err) {
        next(err)
    }
}


function isReady(task : ITask){
    let now = moment(new Date());
    let {hour, minute } = task.period;
    let taskTime = moment().hour(hour).minute(minute);
    

    let {_data} = <any>moment.duration(now.diff(taskTime));
    let {minutes, hours } = _data;

    if((hours == 0 && minutes == 0)) return true
    return false
}