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
const _ = require("lodash");
const fs = require("fs");
var config = require("../../config/vars");
const userController = require("./user.controller");
const file_1 = require("../helper/file");
// import { parseEmail } from "../helper/file";
const PROPERTIES = ["to", "cc", "from", "envelope", "attachment-info", "attachments", "subject", "sender_ip"];
function incomingHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // let result = await parseData(req);
        let data = req.body;
        let files = req.files;
        let selected = selectProperties(data, PROPERTIES);
        let receivedPayload = parse(selected);
        let senderInfo = yield getSenderInfo(receivedPayload.from.email.address);
        if (senderInfo) {
            res.json(receivedPayload);
        }
        else {
            removeFiles(files);
            res.status(401).json(receivedPayload);
        }
    });
}
exports.incomingHandler = incomingHandler;
function removeFiles(files) {
    files.map(file => {
        fs.unlinkSync(file.path);
    });
}
function selectProperties(body, _properties) {
    return _.pick(body, _properties);
}
function parse(data) {
    let payload = getPayload();
    PROPERTIES.map(prop => {
        let _prop = data[prop];
        switch (prop) {
            case "envelope":
                payload["receivedFrom"] = JSON.parse(_prop)["to"];
                break;
            case "to":
            case "cc":
                let received = JSON.parse(data["envelope"])["to"];
                if (_prop)
                    payload[prop] = _.difference(_prop.split(",").map(file_1.parseEmail).map(_v => _v["email"]["address"]), received);
                break;
            case "subject":
                if (_prop)
                    payload[prop] = _prop.trim();
                break;
            case "attachments":
                if (_prop)
                    payload["filesLength"] = parseInt(_prop);
                break;
            case "attachment-info":
                if (_prop)
                    payload["attachments"] = _.values(JSON.parse(_prop));
                break;
            case "sender_ip":
                payload["senderIp"] = _prop;
                break;
            case "from":
                payload[prop] = file_1.parseEmail(_prop);
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
function getSenderInfo(userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield userController.isUserExist(userEmail);
    });
}
