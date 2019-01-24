import { Request, Response, NextFunction } from "express";
var config = require("../../config/vars");
import * as _ from "lodash"

function formLoader() {
    // var _form = new IncomingForm();
    // _form.uploadDir = config.FILE_UPLOAD_DIR;
    // _form.keepExtensions = true;
    // _form.encoding = "utf-8";
    // return _form;
}

const ALLOWED_FILE_EXTENSIONS = /\.(xls|xlsx)$/i

export function fileFilter(request : Request, file : Express.Multer.File, cb){
    if(file.originalname.match(ALLOWED_FILE_EXTENSIONS)){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

export function handleForm(request : Request, response : Response, next : NextFunction){
    console.log(request.body);
    next();
}