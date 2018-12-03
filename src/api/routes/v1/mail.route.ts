import * as express from "express";
const router = express.Router();
import * as mailController from "../../controllers/mail.controller"

router
    .route("/")
    .get(mailController.getFile)

module.exports = router;