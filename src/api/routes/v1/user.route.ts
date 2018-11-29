import * as express from "express";
const validate = require('express-validation');
import * as userController from "../../controllers/"
import { getUser, setUser, getEmails } from "../../validations"
const router = express.Router();

// GET /v1/bolge?kod={bolgeKod}
router
    .route('/')
    .get(userController.getUsersAll)
router
    .route('/dist')
    .get(validate(getEmails), userController.getUsersEmailByDist)
module.exports = router;