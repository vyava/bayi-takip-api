"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const validate = require('express-validation');
const distController = require("../../controllers/dist.controller");
const router = express.Router();
// GET /v1/bolge?kod={bolgeKod}
router
    .route('/')
    .get(distController.getDistAll);
// .get(validate(getDist), distController.getDist)
router
    .route('/yeni')
    // .get(validate(setDist), distController.setDist)
    .get(distController.setDist);
router
    .route('/ayarla')
    // .get(validate(setDist), distController.setDist)
    .get(distController.setDistInfoToBayiler);
router
    .route('/bolge')
    // .get(validate(setDist), distController.setDist)
    .get(distController.getDistIdsByAdresRoute);
module.exports = router;
