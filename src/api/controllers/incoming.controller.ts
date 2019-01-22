import { Request, Response, NextFunction } from "express";
import { IInBound } from "api/interface/incoming.interface";
import { IncomingForm } from "formidable";
var config = require("../../config/vars")

import * as userController from "./user.controller"
// import { parseEmail } from "../helper/file";

export async function incomingHandler(req: Request, res: Response, next: NextFunction) {
    // let result = await parseData(req);

    // let senderInfo = await getSenderInfo(result.sender.email.address);
    let result = req.body

    res.json(result)
}


async function getSenderInfo(userEmail : string){
  return await userController.isUserExist(userEmail);
}