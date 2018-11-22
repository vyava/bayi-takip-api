import * as express from "express";
const validate = require('express-validation');
import * as userController from "../../controllers/"
import {getUser, setUser } from "../../validations"
const router = express.Router();

// GET /v1/bolge?kod={bolgeKod}
router
    .route('/')
        // .get(validate(getUser), userController.getUser)
        .get(userController.getUsers)

router
    .route('/yeni')
        .get(userController.setUser)
module.exports = router;