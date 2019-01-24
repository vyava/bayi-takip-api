import { Request, Response, NextFunction } from "express";
import { IInBound } from "api/interface/incoming.interface";
import * as _ from "lodash"
var config = require("../../config/vars")

import * as userController from "./user.controller"
import { parseEmail } from "../helper/file";
// import { parseEmail } from "../helper/file";

const PROPERTIES = ["to", "cc", "from", "envelope", "attachment-info", "attachments", "subject", "sender_ip"];

export async function incomingHandler(req: Request, res: Response, next: NextFunction) {
  // let result = await parseData(req);

  // let senderInfo = await getSenderInfo(result.sender.email.address);
  let data = req.body;
  let selected = selectProperties(data, PROPERTIES);
  let result = parse(selected);
  // Object.keys(result).map(key => {
  //   result[key] = JSON.parse(result[key])
  // })

  res.json(result)
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
        payload["received"] = JSON.parse(_prop)["to"]
        break;
      case "to":
      case "cc":
        let received = JSON.parse(data["envelope"])["to"]
        payload[prop] = _.difference(_prop.split(",").map(parseEmail).map(_v => _v["email"]["address"]), received)
        break;
      case "subject":
        payload[prop] = _prop.trim()
        break;
      case "attachments":
        payload["filesLength"] = parseInt(_prop)
        break;
      case "attachment-info":
        payload["attachments"] = _.values(JSON.parse(_prop))
        break;
      case "sender_ip":
        payload["senderIp"] = _prop
        break;
      case "from":
        payload[prop] = _prop;
        break;
      default:
        break;
    }
  });

  return payload;
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