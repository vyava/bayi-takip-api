import * as express from "express";
const validate = require('express-validation');
import * as bolgeController from "../../controllers/bolge.controller"
import {setBolge} from "../../validations"
const router = express.Router();

// GET /v1/bolge?kod={bolgeKod}
router
    .route('/')
        .get(bolgeController.getBolge)
router
    .route('/yeni')
        .get(validate(setBolge), bolgeController.setBolge)


module.exports = router;