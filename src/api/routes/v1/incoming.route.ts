import * as express from "express"
import * as validate from "express-validation";
import { handleForm } from "../../helper/formHandler";
import { incomingHandler } from "../../controllers/incoming.controller";

const router = express.Router();

router
    .route("/")
    .post(handleForm, incomingHandler);


module.exports = router;