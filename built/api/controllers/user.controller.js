"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userId = req.query.id || null;
            const user = yield user_model_1.User.getUser(userId);
            res.json(user);
        }
        catch (erre) {
        }
    });
}
exports.getUser = getUser;
;
function setUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let payload = req.query || null;
        const user = yield user_model_1.User.setUser(payload);
        res.json(user);
    });
}
exports.setUser = setUser;
;
