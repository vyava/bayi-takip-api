"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String, required: true },
    email: {
        address: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    collection: "user"
});
userSchema.static('getUser', (_id) => {
    return exports.User.find({ _id: _id });
});
userSchema.static('setUser', (payload) => {
    return exports.User.findOneAndUpdate({ _id: payload._id }, {
        $set: {
            _id: payload._id.toString(),
            firstName: payload.firstName,
            lastName: payload.lastName,
            fullName: payload.firstName + " " + payload.lastName,
            email: {
                name: payload.firstName,
                address: payload.email
            }
        },
    }, {
        upsert: true
    }, (err, user, res) => {
        if (err)
            throw new Error(err);
        console.log(res);
        return Promise.resolve(user);
    });
});
exports.User = mongoose_1.model("User", userSchema);
