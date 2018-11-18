import { ITapdkRequest, TARIH, TARGET } from "./interface/request";
import * as requestPromise from "request-promise";
import * as _ from "lodash";
import { parseBayi } from "./bayi";
import { IBayi } from "api/interface";
var Iconv = require('iconv').Iconv;
// const VAR = require("../../config/vars");

const TAPDK_URL = "http://212.174.130.210/NewTapdk/ViewApp/sorgu.aspx"

export async function getSourceFromExternal() {
    try {
        const ruhsatPattern = new RegExp('^[0-9]+(PT|PI|TI|TT|P|AI|N)+$', 'i');

        let response = await requestPromise.get(TAPDK_URL);

        response = response.replace(/[\r\n\t ]/g, '');

        let requestStates: ITapdkRequest = getStates(response.toString());

        let form = getForm(requestStates);

        response = await requestPromise.post({
            url: TAPDK_URL,
            form: form
        });
        response = response.replace(/[\r\n\t ]/g, '');

        let finalStates: ITapdkRequest = getStates(response);
        let finalForm = getForm(finalStates, true);

        let fileString = await requestPromise.post({
            url: TAPDK_URL,
            form: finalForm,
            encoding: "binary"
        })

        let resultArray = parseFileString(fileString);

        const finalResult : [] = resultArray.reduce((_result : IBayi[], val, i, currentArray) => {

            if (val.match(ruhsatPattern)) {
                // Dizi içinde eşleşen `ruhsatNo` indexini alır ve bayi bilgilerinin..
                // ..tamamını alacak şekilde mevcut diziden ilgili diziyi ayırır.
                let chunkArray : any = currentArray.slice(i - 2, i + 7);

                let bayi : IBayi = parseBayi(chunkArray);
                _result.push(bayi)
            };
            return _result;
        }, [])

        return finalResult;
    } catch (err) {
        // console.log(err)
        throw err;
    }
};

function getStates(text: string) {
    let viewPattern = new RegExp(/(?:")(__VIEWSTATE)(?:"value=")(.*?)(?:"\/>)/, "g");
    let eventPattern = new RegExp(/(?:")(__EVENTVALIDATION)(?:"value=")(.*?)(?:"\/>)/, "g");

    var validate: any = {}
    var match;

    while ((match = viewPattern.exec(text)) !== null) {
        validate['__VIEWSTATE'] = match[2];
    }
    while ((match = eventPattern.exec(text)) !== null) {
        validate['__EVENTVALIDATION'] = match[2];
    }
    return validate
};


function getForm(state: ITapdkRequest, isFile: boolean = false): ITapdkRequest {

    let formData: ITapdkRequest = {
        dd_tarih: TARIH.SON_7_GÜN,
        dd_islem: -1,
        TXT_SICIL: "%PT%",
        dd_il: 0,
        DropDownList_CountViewGrid: 100
    }
    if (isFile) {
        formData['__EVENTTARGET'] = TARGET.FILE
    }
    let form = _.assign({}, state, formData);
    return form;
};

function parseFileString(binaryData: string): any[] {
    const parsePattern = new RegExp("(<([^>]+)>)", "ig");
    const tagPattern = new RegExp("(?=>([^<]+)\r?\n?|\r?$)(.*?|\r?\n|\r)(?=<)", "g");

    let binary = new Buffer(binaryData, 'binary');
    var iconv = new Iconv('windows-1254', 'utf-8')

    let fileString = iconv.convert(binary).toString();

    var dataArray = [];
    var match;

    while ((match = tagPattern.exec(fileString)) !== null) {
        let clear = match[1].trim().replace(parsePattern, '');
        dataArray.push(clear)
    }

    return dataArray
}