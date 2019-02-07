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
const request_1 = require("./interface/request");
const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const dist_controller_1 = require("../controllers/dist.controller");
// const httpStatus = require('http-status');
const httpStatus = require("http-status");
const APIError = require('../utils/APIError');
const _ = require("lodash");
const bayi_1 = require("./bayi");
const string_1 = require("./string");
var Iconv = require('iconv').Iconv;
const TAPDK_URL = "http://212.174.130.210/NewTapdk/ViewApp/sorgu.aspx";
exports.ruhsatPattern = new RegExp('^[0-9]+(PT|PI|TI|TT|P|AI|N|TE)+$', 'i');
function getSourceFromExternal(params) {
    return __awaiter(this, void 0, void 0, function* () {
        let { gun } = params;
        try {
            let response;
            try {
                response = yield requestPromise.get(TAPDK_URL);
            }
            catch (error) {
                throw new APIError({
                    message: "Kaynakla bağlantı kurulamadı",
                    errors: "connection"
                });
            }
            // Html etiketleri arasındaki gereksiz yeni satırlar..
            // .. tab boşluklarını siler
            response = string_1.removeSpacesFromString(response);
            let requestStates = getStates(response);
            let form = getForm(requestStates, false, gun);
            try {
                response = yield requestPromise.post({
                    url: TAPDK_URL,
                    form: form
                });
            }
            catch (err) {
                throw new APIError({
                    message: "İlk istek başarısız"
                });
            }
            let finalStates = getStates(response, true);
            let finalForm = getForm(finalStates, true, gun);
            let fileString;
            try {
                fileString = yield requestPromise.post({
                    url: TAPDK_URL,
                    form: finalForm,
                    encoding: "binary"
                });
            }
            catch (fileArray) {
                throw new APIError({
                    message: "Belirtilen parametreyle dosya alınamadı",
                    status: httpStatus.BAD_REQUEST,
                    errors: "connection"
                });
            }
            fileString = string_1.removeSpacesFromString(fileString);
            let resultArray = parseFileString(fileString);
            let result = yield getArrayFromSource(resultArray);
            return Promise.all(result)
                .then(bayiler => {
                return bayiler;
            })
                .catch(err => {
                throw err;
            });
        }
        catch (err) {
            throw err;
        }
    });
}
exports.getSourceFromExternal = getSourceFromExternal;
;
function getArrayFromSource(resultArray) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let bolgeData = [];
            const finalResult = resultArray.reduce((_result, val, i, currentArray) => {
                if (val.match(exports.ruhsatPattern)) {
                    // Dizi içinde eşleşen `ruhsatNo` indexini alır ve bayi bilgilerinin..
                    // ..tamamını alacak şekilde mevcut diziden ilgili diziyi ayırır.
                    let chunkArray = currentArray.slice(i - 2, i + 7);
                    let bayi = bayi_1.parseBayi(chunkArray);
                    // Bölge listesinde il ve ilçeleri tekil olarak push eder..
                    bolgeData = _.unionWith(bolgeData, [bayi.il], _.isEqual);
                    _result.push(bayi);
                }
                ;
                return _result;
            }, []);
            // Get distId aggregate
            let bolgeResult = yield dist_controller_1.getDistIdsByAdres(bolgeData);
            bolgeResult.map(bolge => {
                let bayiler = _.filter(finalResult, (bayi) => (bayi.il == bolge["il"] && bayi.ilce == bolge["ilce"]));
                bayiler.map(bayi => {
                    bayi.distributor = _.union(bayi.distributor, [bolge["distId"]]);
                    bayi.altBolge = bolge["altBolge"];
                });
            });
            return finalResult;
        }
        catch (err) {
            throw err;
        }
    });
}
;
function getDistIds(il, ilce) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield dist_controller_1.getDistIdsByAdres([il])) || [];
    });
}
function getStates(text, last = false) {
    try {
        let viewPattern = new RegExp(/(?:")(__VIEWSTATE)(?:"value=")(.*?)(?:"\/>)/, "g");
        let eventPattern = new RegExp(/(?:")(__EVENTVALIDATION)(?:"value=")(.*?)(?:"\/>)/, "g");
        let $ = cheerio.load(text);
        // console.log(text)
        var validate = {};
        var match;
        validate['__VIEWSTATE'] = $("#__VIEWSTATE").attr("value");
        validate['__EVENTVALIDATION'] = $("#__EVENTVALIDATION").attr("value");
        // while ((match = viewPattern.exec(text)) !== null) {
        //     validate['__VIEWSTATE'] = match[2];
        // }
        // while ((match = eventPattern.exec(text)) !== null) {
        //     validate['__EVENTVALIDATION'] = match[2];
        // }
        if (_.isEmpty(validate['__EVENTVALIDATION']) || _.isEmpty(validate['__VIEWSTATE'])) {
            throw new APIError({
                message: "Validation alınamadı. Kaynak çalışmıyor olabilir.",
                status: httpStatus.NOT_ACCEPTABLE,
                errors: "connection"
            });
        }
        if (last) {
            if ($("#Button_Print").attr("id") != "Button_Print") {
                throw new APIError({
                    message: "no content",
                    status: httpStatus.NOT_FOUND,
                    errors: "noContent"
                });
            }
        }
        return validate;
    }
    catch (err) {
        throw err;
    }
}
;
function getForm(state, isFile = false, gun) {
    let formData = {
        dd_tarih: request_1.TARIH[gun],
        dd_islem: -1,
        TXT_SICIL: "%%",
        dd_il: 0,
        DropDownList_CountViewGrid: 100
    };
    if (isFile) {
        formData['__EVENTTARGET'] = request_1.TARGET.FILE;
    }
    let form = _.assign({}, state, formData);
    return form;
}
;
function parseFileString(binaryData) {
    try {
        const parsePattern = new RegExp("(<([^>]+)>)", "ig");
        const tagPattern = new RegExp("(?=>([^<]+)\r?\n?|\r?$)(.|\n)*?(?=<)", "g");
        let binary = new Buffer(binaryData, 'binary');
        var iconv = new Iconv('windows-1254', 'utf-8');
        let fileString = iconv.convert(binary).toString();
        var dataArray = [];
        var match;
        while ((match = tagPattern.exec(fileString)) !== null) {
            let clear = match[1].trim().replace(parsePattern, '');
            dataArray.push(clear);
        }
        if (dataArray.length < 1) {
            throw new APIError({
                message: "Bayi bulunamadı",
                state: httpStatus.NOT_MODIFIED,
                error: "connection"
            });
        }
        return dataArray;
    }
    catch (err) {
        throw err;
    }
}
