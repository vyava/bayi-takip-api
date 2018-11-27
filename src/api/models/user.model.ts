import { Model, Document, Schema, DocumentQuery, model, Types } from "mongoose";
import { IUserDocument, IBolge, IUser } from "../interface";
import "../models/distributor.model"

export interface IUserDocumentModel extends Model<IUserDocument> {
    getUser(id: number): any;
    setUser(payload: IUser): any;
    getUsers(): IUserDocument[];
}

const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: new Schema({
        address: {
            type: String,
            required: true,
            unique: true,
            sparse: true
        },
        name: {
            type: String,
            required: true
        }
    }),
    taskName: {
        type: String,
        enum: ["rsm", "dsm", "tte", "operator"],
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    distributor: {
        type: Schema.Types.ObjectId, ref: 'Dist', default: null
    }
}, {
        collection: "users",
        toJSON: {
            transform: (doc, ret) => {
                delete ret._id
            }
        },
        timestamps : {
            createdAt : "created_at",
            updatedAt : "updated_at"
        }
    });

userSchema.static('getUser', (_id: number) => {
    return User.find({ _id: _id });
});

userSchema.static('getUsers', () => {
    return User.find().populate({
        path: "distributor",
        select: ["kod", "name"]
    });
});

userSchema.static('setUser', (payload: IUser) => {
    let user = new User(payload);
    return user.save();
    // return User.findOneAndUpdate(
    //     { _id: payload._id },
    //     {
    //         $set: {
    //             _id: payload._id.toString(),
    //             firstName: payload.firstName,
    //             lastName: payload.lastName,
    //             fullName: payload.firstName + " " + payload.lastName,
    //             email: {
    //                 name : payload.firstName,
    //                 address : payload.email
    //             }
    //         },
    //     },
    //     {
    //         upsert: true
    //     },
    //     (err, user, res) => {
    //         if(err) throw new Error(err);
    //         console.log(res);
    //         return Promise.resolve(user);
    //     }
    // )
});

export const User: IUserDocumentModel = model<IUserDocument, IUserDocumentModel>("User", userSchema);