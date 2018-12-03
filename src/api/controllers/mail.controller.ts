import { NextFunction, Request, Response, Router } from 'express';
import * as Excel from "../helper/excel"

export async function getFile(req : Request, res : Response, next : NextFunction){
    let _worksheet = Excel.addValuesToWorksheet(["test1", "test2", "test3"], [1,2,3]);
    res.json(_worksheet.model)
}