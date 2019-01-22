import { Request, Response, NextFunction } from "express";
import { IncomingForm } from "formidable";
var config = require("../../config/vars");
import * as _ from "lodash"

function formLoader() {
    var _form = new IncomingForm();
    _form.uploadDir = config.FILE_UPLOAD_DIR;
    _form.keepExtensions = true;
    _form.encoding = "utf-8";
    return _form;
}

const ALLOWED_FILE_EXTENSIONS = /\.(xls|xlsx)$/i

export function handleForm(request : Request, response : Response, next : NextFunction){
    // console.log(request.headers)
    var form = formLoader();
    var result = {
        field : {},
        files : [],
        error : null
    };
    
    // Handle fields
    form.on('field', (name, value) => {
        result["field"][name] = value;
    })

    // Handle files
    // form.on('fileBegin', (name, file) => {
    //     if(!file.name.match(ALLOWED_FILE_EXTENSIONS)){
    //         form.emit("error")
    //         // this.emit("error")
    //         return;
    //     }
    // });

    // // Handle files
    // form.on('file', (name, file) => {
    //     if(file.name.match(ALLOWED_FILE_EXTENSIONS) && file != null){
    //         result["files"].push(file);
    //     }else{
    //         form.emit("error")
    //         return;
    //     }
    // });
    form.onPart = function(part){
        if(part.filename && part.filename.match(ALLOWED_FILE_EXTENSIONS)){
            this.handlePart(part)
        }else if(!part.filename){
            this.handlePart(part);
        }
    }

    // Handle errors
    form.on('error', (err) => {
        if(err){
            result = {
                field : null,
                files : null,
                error : err
            }
        }
    });

    // Handle aborted
    form.on('aborted', () => {
        result = {
            field : null,
            files : null,
            error : "Upload aborted!"
        }
    });

    // Handle end of stream
    // form.on('end', () => {
    //     result = {
    //         field : null,
    //         file : null,
    //         error : "Upload error!"
    //     }
    // });

    // Handle end of stream
    form.parse(request, (err, fields, files) => {
        if(err) {
            throw new Error("Form couldn't proceed")
        }
        // request.body = result;
        request.body = {
            fields : fields,
            files : _.values(files)
        }
        next()
    });
}