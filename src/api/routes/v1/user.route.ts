import * as express from "express";
const validate = require('express-validation');
import * as userController from "../../controllers/"
import {getUser, setUser } from "../../validations"
const router = express.Router();

// GET /v1/bolge?kod={bolgeKod}
router
    .route('/')
        .get(validate(getUser), userController.getDist)

router
    .route('/yeni')
        .get(validate(setUser), userController.setDist)
module.exports = router;