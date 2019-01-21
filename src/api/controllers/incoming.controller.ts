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

async function parseData(request : Request) {
  
  // form.parse(request, function (err, fields, files: any) {
  //   if (err) {
  //     result["error"] = "Parse başarısız"
  //   }
  //   result["fields"] = fields;
  //   result["files"] = files;
  //   result["sender"] = parseSender(fields["from"])
  // });
  // return result;
};



// function parseSender(text){
//   return parseEmail(text);
// }

async function getSenderInfo(userEmail : string){
  return await userController.isUserExist(userEmail);
}