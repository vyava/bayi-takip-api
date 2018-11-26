import * as express from "express";
const validate = require('express-validation');
import * as bolgeController from "../../controllers/bolge.controller"
import { getBolgeById } from "../../validations"
const router = express.Router();

// GET /v1/bolge?kod={bolgeKod}
router
    .route('/')
    .get(validate(getBolgeById), bolgeController.getBolgeById)
module.exports = router;