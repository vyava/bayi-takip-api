var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import axios from "axios";
const axios = require("axios");
// const VAR = require("../../config/vars")
function getSourceFromExternal() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield axios.post("http://212.174.130.210/NewTapdk/ViewApp/sorgu.aspx");
        console.log(res);
    });
}
;
getSourceFromExternal();
