import { NextFunction, Request, Response, Router } from 'express';
import { Bolge } from '../models/bolge.model';
import { IBolge } from '../interface';
export async function getBolge(req : Request, res : Response){
    let bolgeKod = req.query.kod || null
    const bolge = await Bolge.getBolge(bolgeKod);

    res.json(bolge);
};

export async function setBolge(req : Request, res : Response){
    let payload : IBolge = req.query || null

    const bolge = await Bolge.setBolge(payload);
    res.json(bolge);
};
