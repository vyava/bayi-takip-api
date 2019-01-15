import * as express from "express"
import * as validate from "express-validation";
import { incomingHandler } from "../../controllers/incoming.controller";

const router = express.Router();

router
    .route("/")
    .post(incomingHandler);


module.exports = router;