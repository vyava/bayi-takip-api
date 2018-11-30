import { ITapdkRequest, TARIH, TARGET } from "./interface/request";
import * as requestPromise from "request-promise";

import { getDistIdsByAdres } from "../controllers/dist.controller";

import * as _ from "lodash";
import { parseBayi } from "./bayi";
import { IBayi } from "api/interface";
var Iconv = require('iconv').Iconv;
// const VAR = require("../../config/vars");

const TAPDK_URL = "http://212.174.130.210/NewTapdk/ViewApp/sorgu.aspx"
const ruhsatPattern = new RegExp('^[0-9]+(PT|PI|TI|TT|P|AI|N)+$', 'i');
export async function getSourceFromExternal() {
    try {
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
        let result = await getArrayFromSrouce(resultArray)
        return Promise.all(result)
            .then(resp => {
                return resp
            })
            .catch(err => {
                throw err
            })
    } catch (err) {
        // console.log(err)
        throw err;
    }
};

async function getArrayFromSrouce(resultArray : any[]){
    let bolgeData : any = {};
    const finalResult : [] = resultArray.reduce((_result : IBayi[], val, i, currentArray) => {
        if (val.match(ruhsatPattern)) {
            // Dizi içinde eşleşen `ruhsatNo` indexini alır ve bayi bilgilerinin..
            // ..tamamını alacak şekilde mevcut diziden ilgili diziyi ayırır.
            let chunkArray : any = currentArray.slice(i - 2, i + 7);

            let bayi : IBayi = parseBayi(chunkArray);
            

            // Bölge listesinde il ve ilçeleri tekil olarak push eder..
            if(_.has(bolgeData, bayi.il) ){
                if(!_.find(bolgeData[bayi.il], bolge => bolge.ilce == bayi.ilce)){
                    bolgeData[bayi.il].push({
                        name : bayi.ilce
                    })    
                }                  
            }else{
                bolgeData[bayi.il] = [];
                bolgeData[bayi.il].push({
                    name : bayi.ilce
                })
            }
            _result.push(bayi)
        };
        return _result;
    }, []);
    
    return _.map(finalResult, async (bayi : IBayi) => {
        // if(bayi.il == "İSTANBUL"){
            bayi.distributor = await getDistIds(bayi.il, bayi.ilce);
        // }
        return bayi;
    })
    // let bolge = await getDistIds(bolgeData)
    // Promise.all(bolge).then(r => console.log)
    // return finalResult;
};

async function getDistIds(il : string, ilce : string){
    return await getDistIdsByAdres(il, ilce);
}

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
        dd_tarih: TARIH.DÜN,
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