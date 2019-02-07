"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("../../config/vars");
function formLoader() {
    // var _form = new IncomingForm();
    // _form.uploadDir = config.FILE_UPLOAD_DIR;
    // _form.keepExtensions = true;
    // _form.encoding = "utf-8";
    // return _form;
}
const ALLOWED_FILE_EXTENSIONS = /\.(xls|xlsx)$/i;
function fileFilter(request, file, cb) {
    if (file.originalname.match(ALLOWED_FILE_EXTENSIONS)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
exports.fileFilter = fileFilter;
function handleForm(request, response, next) {
    console.log(request.body);
    next();
}
exports.handleForm = handleForm;
