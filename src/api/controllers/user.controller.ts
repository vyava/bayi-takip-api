import { NextFunction, Request, Response, Router } from 'express';
import { User } from '../models/user.model';
import { IUser } from '../interface';

export async function getUser(req: Request, res: Response) {
    try {
        let userId = req.query.id || null
        const user = await User.getUser(userId);

        res.json(user);
    } catch (erre) {

    }

};

export async function setUser(req: Request, res: Response) {
    let payload: IUser = req.query || null

    const user = await User.setUser(payload);
    res.json(user);
};