import * as express from "express"
import * as validate from "express-validation";
import * as multer from "multer"
const path = require("path")
import { handleForm, fileFilter } from "../../helper/formHandler";
import { incomingHandler } from "../../controllers/incoming.controller";
const config = require("../../../config/vars");

var storage = multer.diskStorage({
    destination : config.FILE_UPLOAD_DIR,
    filename : function(req, file, cb){
        cb(null, Date.now()+path.extname(file.originalname))
    }
})

const router = express.Router();
const upload = multer({
    storage : storage,
    fileFilter : fileFilter
});


router
    .route("/")
    .post(upload.any(), incomingHandler);


module.exports = router;