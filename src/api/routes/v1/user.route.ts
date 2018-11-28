import * as express from "express";
const validate = require('express-validation');
import * as userController from "../../controllers/"
import { getUser, setUser, getEmails } from "../../validations"
const router = express.Router();

// GET /v1/bolge?kod={bolgeKod}
router
    .route('/')
    // .get(validate(getUser), userController.getUser)
    .get(userController.getUsersAll)
router
    .route('/dist')
    // .get(validate(getUser), userController.getUser)
    .get(validate(getEmails), userController.getUsersEmailByDist)
router
    .route('/:email')
    // .get(validate(getUser), userController.getUser)
    .get(userController.getUserByEmail)
router
    .route('/yeni')
    .get(userController.setUser)
module.exports = router;