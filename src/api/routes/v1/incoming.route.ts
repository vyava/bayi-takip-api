import * as express from "express"
import * as validate from "express-validation";
import * as multer from "multer"
import { handleForm, fileFilter } from "../../helper/formHandler";
import { incomingHandler } from "../../controllers/incoming.controller";
const config = require("../../../config/vars")

const router = express.Router();
const upload = multer({
    dest : config.FILE_UPLOAD_DIR,
    fileFilter : fileFilter
});


router
    .route("/")
    .post(upload.any(), incomingHandler);


module.exports = router;