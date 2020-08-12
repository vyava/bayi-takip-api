import { NextFunction, Request, Response, Router } from 'express';
import * as _ from "lodash"
import { IBolge } from '../interface';
import * as mongoose from "mongoose";
import "../models/bolge.model"
import * as httpStatus from "http-status"
const APIError = require('../utils/APIError');

const BolgeModel = mongoose.model("Bolge");


export async function getBolgeById(req: Request, res: Response, next: NextFunction) {
    try {
        let bolgeKod = req.query.kod || null
        const bolge = await BolgeModel.find({
            bolgeKod: bolgeKod
        });
        if (_.isEmpty(bolge)) throw new APIError({
            message: "Bölge bulunamadı",
            status: httpStatus.NOT_FOUND
        });
        res.json(bolge);
    } catch (err) {
        next(err)
    }
};