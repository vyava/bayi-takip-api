import * as requestPromise from "request-promise";
import * as mongoose from "mongoose"
import "../models/task.model"
import { ITaskModel } from "../models/task.model";

const TaskModel : ITaskModel = mongoose.model("Task");

export async function addTask(){
    let task = new TaskModel();
    // task.executeTime = Date.now();
    task.name = "Deneme";
    task.done = false;
    task.save();

    return await task;
}