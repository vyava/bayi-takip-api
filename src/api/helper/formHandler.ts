import { Request, Response, NextFunction } from "express";
import { IncomingForm } from "formidable";
var config = require("../../config/vars");

function formLoader() {
    var _form = new IncomingForm();
    _form.uploadDir = config.FILE_UPLOAD_DIR;
    _form.keepExtensions = true;
    _form.encoding = "utf-8";
    return _form;
}

export function handleForm(request : Request, response : Response, next : NextFunction){
    var form = formLoader();
    var result = {
        field : {},
        files : [],
        error : null
    };
    
    // Handle fields
    form.on('field', (name, value) => {
        result["field"][name] = value;
    });

    // Handle files
    form.on('file', (name, file) => {
        result["files"].push(file);
    });

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
        request.body = result;
        next()
    });
}