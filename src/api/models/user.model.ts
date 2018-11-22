import { Model, Document, Schema, DocumentQuery, model, Types } from "mongoose";
import { IUserDocument, IBolge, IUser } from "../interface";

export interface IUserDocumentModel extends Model<IUserDocument> {
    getUser(id: number): any;
    setUser(payload : IUser) : any;
    getUsers() : IUserDocument[];
}

const userSchema: Schema = new Schema({
    firstName: {type : String, required : false},
    lastName: {type : String, required : false},
    fullName: {type : String, required : true},
    email: {
        address : {
            type : String,
            required : true
        },
        name : {
            type : String,
            required : true
        }
    },
    status : {
        type : Boolean,
        default : true
    },
    distributor : {
        type : Schema.Types.ObjectId, ref : 'Dist', default : null
    }
}, {
        collection: "user"
    });

userSchema.static('getUser', (_id: number) => {
    return User.find({ _id: _id });
});

userSchema.static('getUsers', () => {
    return User.find().populate({
        path : "distributor",
        select : ["kod", "name"]
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