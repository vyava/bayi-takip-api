import * as express from "express"
import * as validate from "express-validation";
const router = express.Router();
import * as mailController from "../../controllers/mail.controller"
import { send } from "../../validations/mail.validation";

router
    .route("/")
    .get(validate(send), mailController.send)

module.exports = router;