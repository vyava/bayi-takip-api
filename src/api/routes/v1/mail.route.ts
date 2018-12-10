import * as express from "express";
const router = express.Router();
import * as mailController from "../../controllers/mail.controller"

router
    .route("/")
    .get(mailController.send)

module.exports = router;