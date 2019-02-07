"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const validate = require('express-validation');
const taskController = require("../../controllers/task.controller");
const router = express.Router();
// GET /v1/task
router
    .route('/')
    .get(taskController.getTask);
module.exports = router;
