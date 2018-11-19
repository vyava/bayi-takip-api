import * as express from "express";
const validate = require('express-validation');
import * as distController from "../../controllers/dist.controller"
import {getDist, setDist, getDistSByAdres } from "../../validations"
const router = express.Router();

// GET /v1/bolge?kod={bolgeKod}
router
    .route('/')
        .get(validate(getDist), distController.getDist)

router
    .route('/yeni')
        .get(validate(setDist), distController.setDist)
router
    .route('/byBolge')
        .get(validate(getDistSByAdres), distController.getDistSByAdres)
module.exports = router;