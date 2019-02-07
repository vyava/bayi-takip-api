"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const moment = require("moment");
require("../models/task.model");
// import { getSource } from "../controllers/tapdk.controller";
var modules = require("./index");
const TaskModel = mongoose.model("Task");
function addTask() {
    return __awaiter(this, void 0, void 0, function* () {
        let task = new TaskModel();
        task.name = "TAPDK";
        task.done = false;
        task.active = true;
        task.period.startHour = 8;
        task.period.stopHour = 20;
        task.period.startMinute = 0;
        task.period.stopMinute = 60;
        task.save();
        return yield task;
    });
}
exports.addTask = addTask;
function run(taskName) {
    if (modules[taskName]) {
        return modules[taskName];
    }
    throw new Error(`'${taskName}' adında task bulunamadı`);
}
function getTask(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { _day, _hour, _minute } = getDateParsed();
            let task = yield TaskModel.find({
                active: true,
                "period.days": {
                    $eq: _day
                },
                "period.startHour": {
                    $lte: _hour
                },
                "period.stopHour": {
                    $gte: _hour
                },
                "period.startMinute": {
                    $lte: _minute
                },
                "period.stopMinute": {
                    $gte: _minute
                }
            }).limit(1).sort({
                _id: -1
            });
            if (task.length < 1)
                throw new Error("Task bulunamadı");
            // if(isReady(task[0])){
            req.body = {
                params: task[0].params,
                taskId: task[0]._id
            };
            let taskName = task[0].name;
            run(taskName)(req, res, next);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getTask = getTask;
function taskDone(task) {
    return __awaiter(this, void 0, void 0, function* () {
        task.active = true;
        task.updatedAt = new Date();
        task.done = true;
        return yield task.save();
    });
}
exports.taskDone = taskDone;
function taskBlock(task) {
    return __awaiter(this, void 0, void 0, function* () {
        task.active = false;
        return yield task.save();
    });
}
exports.taskBlock = taskBlock;
function taskError(task) {
    return __awaiter(this, void 0, void 0, function* () {
        task.active = true;
        task.updatedAt = new Date();
        task.done = false;
        return yield task.save();
    });
}
exports.taskError = taskError;
function findTaskById(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield TaskModel.findById(taskId);
    });
}
exports.findTaskById = findTaskById;
function getDateParsed() {
    let now = moment().toDate();
    let _hour = now.getHours();
    let _minute = now.getMinutes();
    let _day = now.getDay();
    return { _day, _hour, _minute };
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
