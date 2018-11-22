import { NextFunction, Request, Response, Router } from 'express';
import { User, Dist } from '../models';
import { getDist } from "../controllers";
import { IUser, IDistributor } from '../interface';
import { ObjectID } from 'bson';

export async function getUser(req: Request, res: Response, next : NextFunction) {
    try {
        let userId = req.query.id || null
        const user = await User.getUser(userId);

        res.json(user);
    } catch (err) {
        next(err)
    }
};

export async function getUsers(req: Request, res: Response, next : NextFunction) {
    try {
        const users = await User.getUsers();

        res.json(users);
    } catch (err) {
        next(err)
    }
};

export async function setUser(req: Request, res: Response) {
    let dists = await Dist.getDistAll();
    dists.map(dist => {
        let {kod} = dist.toJSON();

        let user = User.setUser({
            email : {
                address: "umitozdelice@gmail.com",
                name: "Ümit ÖZDELİCE"
            },
            firstName : "",
            lastName : "",
            status : true,
            fullName : "Ümit ÖZDELİCE",
            distributor : "5bec5cb8fb6fc005dcd59a72",
            _id : new ObjectID()
        })
        
        

    })
    // const user = await User.setUser(payload);
    res.json(dists);
};