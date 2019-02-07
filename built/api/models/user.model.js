"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
require("../models/distributor.model");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Dist', default: null
    }
}, {
    collection: "users",
    toJSON: {
        transform: (doc, ret) => {
            delete ret._id;
        }
    },
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
userSchema.static('getUser', (_id) => {
    return exports.User.find({ _id: _id });
});
userSchema.static('getUsers', () => {
    return exports.User.find().populate({
        path: "distributor",
        select: ["kod", "name"]
    });
});
userSchema.static('setUser', (payload) => {
    let user = new exports.User(payload);
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
exports.User = mongoose_1.model("User", userSchema);
