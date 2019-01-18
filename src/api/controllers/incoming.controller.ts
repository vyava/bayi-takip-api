import { Request, Response, NextFunction } from "express";
import { IInBound } from "api/interface/incoming.interface";
import { IncomingForm } from "formidable";

import * as userController from "./user.controller"
import { parseEmail } from "../helper/file";

export async function incomingHandler(req: Request, res: Response, next: NextFunction) {
    let result = await parseData(req);

    console.log(await verifySender(result.sender.email.address))

    res.json(result)
}

async function parseData(request : Request) {
  var form = new IncomingForm();
  let result = {
    error : null,
    fields : null,
    files : null,
    sender : null
  };
  form.parse(request, function (err, fields, files: any) {
    if (err) {
      result["error"] = "Parse başarısız"
    }
    result["fields"] = fields;
    result["files"] = files;
    result["sender"] = parseSender(fields["from"])
  });
  return result;
};

function parseSender(text){
  return parseEmail(text);
}

async function verifySender(userEmail : string){
  return await userController.isUserExist(userEmail)
}