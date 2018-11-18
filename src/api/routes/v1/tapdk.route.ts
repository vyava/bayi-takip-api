import * as express from "express";
const validate = require('express-validation');
import { getSource } from "../../validations";
import * as tapdkController from "../../controllers/tapdk.controller"
const router = express.Router();

// GET /v1/bolge?kod={bolgeKod}
router
    .route('/')
        .get(validate(getSource), tapdkController.getSource)


module.exports = router;