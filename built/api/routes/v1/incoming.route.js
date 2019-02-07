"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const multer = require("multer");
const path = require("path");
const formHandler_1 = require("../../helper/formHandler");
const incoming_controller_1 = require("../../controllers/incoming.controller");
const config = require("../../../config/vars");
var storage = multer.diskStorage({
    destination: config.FILE_UPLOAD_DIR,
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const router = express.Router();
const upload = multer({
    storage: storage,
    fileFilter: formHandler_1.fileFilter
});
router
    .route("/")
    .post(upload.any(), incoming_controller_1.incomingHandler);
module.exports = router;
