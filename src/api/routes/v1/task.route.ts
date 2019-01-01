import * as express from "express";
const validate = require('express-validation');
import * as taskController from "../../controllers/task.controller"
const router = express.Router();

// GET /v1/task
router
    .route('/')
    .get(taskController.getTask);

module.exports = router;