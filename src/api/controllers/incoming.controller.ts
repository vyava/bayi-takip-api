import { Request, Response, NextFunction } from "express";
import { IInBound } from "api/interface/incoming.interface";
import * as _ from "lodash"
import {join} from "path"
import * as fs from "fs"
var config = require("../../config/vars")

import * as userController from "./user.controller"
import { parseEmail } from "../helper/file";
import { IncomingPayload } from "api/helper/interface/mail.interface";
import { Attachment } from "../helper/interface/mail.interface";
// import { parseEmail } from "../helper/file";

const PROPERTIES = ["to", "cc", "from", "envelope", "attachment-info", "attachments", "subject", "sender_ip"];

export async function incomingHandler(req: Request, res: Response, next: NextFunction) {
  // let result = await parseData(req);
  let data = req.body;
  let files = req.files
  let selected = selectProperties(data, PROPERTIES);
  let receivedPayload : IncomingPayload = parse(selected);
  let senderInfo = await getSenderInfo(receivedPayload.from.email.address);

  if(senderInfo){
    res.json(receivedPayload)
  }else{
    removeFiles(files)
    res.status(401).json(receivedPayload)
  }
  
}

function selectProperties(body, _properties: string[]) {
  return _.pick(body, _properties)
}

function parse(data) {
  
  let payload = getPayload();

  PROPERTIES.map(prop => {
    let _prop = data[prop];
    switch (prop) {
      case "envelope":
        payload["receivedFrom"] = JSON.parse(_prop)["to"]
        break;
      case "to":
      case "cc":
        let received = JSON.parse(data["envelope"])["to"]
        if(_prop)
          payload[prop] = _.difference(_prop.split(",").map(parseEmail).map(_v => _v["email"]["address"]), received)
        break;
      case "subject":
      if(_prop)
          payload[prop] = _prop.trim()
        break;
      case "attachments":
        if(_prop)
          payload["filesLength"] = parseInt(_prop)
        break;
      case "attachment-info":
        if(_prop)
          payload["attachments"] = _.values(JSON.parse(_prop))
        break;
      case "sender_ip":
        payload["senderIp"] = _prop
        break;
      case "from":
        payload[prop] = parseEmail(_prop);
        break;
      default:
        break;
    }
  });

  return payload;
}

function removeFiles(paths){
  for(var i=0;i<paths.length;i++){
    
    let path = join(config.FILE_UPLOAD_DIR, paths[i]);
    // fs.unlinkSync(path);
  };
}

function getPayload() {
  return {
    to: [],
    cc: [],
    subject: "",
    filesLength: 0,
    "attachments": [],
    senderIp: null
  };
}

async function getSenderInfo(userEmail: string) {
  return await userController.isUserExist(userEmail);
}