import { ITapdkRequest, TARIH, TARGET } from "./interface/request";
import * as requestPromise from "request-promise";

import * as cheerio from "cheerio";

import { getDistIdsByAdres, getBolgeNameByAdres } from "../controllers/dist.controller";

// const httpStatus = require('http-status');
import * as  httpStatus from "http-status"
const APIError = require('../utils/APIError');

import * as _ from "lodash";
import { parseBayi } from "./bayi";
import { IBayi } from "api/interface";
import { removeSpacesFromString } from "./string";
var Iconv = require('iconv').Iconv;
// const VAR = require("../../config/vars");

const TAPDK_URL = "http://212.174.130.210/NewTapdk/ViewApp/sorgu.aspx"
export const ruhsatPattern = new RegExp('^[0-9]+(PT|PI|TI|TT|P|AI|N)+$', 'i');
export async function getSourceFromExternal(gun : string) {
    try {
        let response;
        try {
            response = await requestPromise.get(TAPDK_URL);    
        } catch (error) {
            throw new Error("Kaynakla bağlantı kurulamadı")
        }
        
        
        // Html etiketleri arasındaki gereksiz yeni satırlar..
        // .. tab boşluklarını siler
        response = removeSpacesFromString(response);
        let requestStates: ITapdkRequest = getStates(response);

        let form = getForm(requestStates, false, gun);

        try {
            response = await requestPromise.post({
                url: TAPDK_URL,
                form: form
            });    
        } catch (err) {
            throw new APIError({
                message : "İlk istek başarısız"
            })
        }
        

        let finalStates: ITapdkRequest = getStates(response);
        let finalForm = getForm(finalStates, true, gun);

        let fileString;
        try {
            fileString = await requestPromise.post({
                url: TAPDK_URL,
                form: finalForm,
                encoding: "binary"
            });
        } catch (fileArray) {
            throw new APIError({
                message : fileArray,
                err : fileArray
            })
        }

        fileString = removeSpacesFromString(fileString);
        let resultArray = parseFileString(fileString);
        let result = getArrayFromSource(resultArray)
        return Promise.all(result)
            .then(bayiler => {
                return bayiler
            })
            .catch(err => {
                throw err
            })
    } catch (err) {
        throw err
    }
};

function getArrayFromSource(resultArray : any[]){
    try {
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
            // if(bayi.il == "İSTANBUL" && bayi.ilce == "PENDİK"){
                bayi.distributor = await getDistIds(bayi.il, bayi.ilce);
                bayi.altBolge = !_.isEmpty(bayi.distributor)
                                    ? await getBolgeNameByAdres(bayi.distributor[0]) : null
            // }
            return bayi;
        })
        // let bolge = await getDistIds(bolgeData)
        // Promise.all(bolge).then(r => console.log)
        // return finalResult;
    } catch (err) {
        throw err
    }
    
};

async function getDistIds(il : string, ilce : string){
    return await getDistIdsByAdres(il, ilce) ||[];
}

function getStates(text: string) {
    try {
        let viewPattern = new RegExp(/(?:")(__VIEWSTATE)(?:"value=")(.*?)(?:"\/>)/, "g");
        let eventPattern = new RegExp(/(?:")(__EVENTVALIDATION)(?:"value=")(.*?)(?:"\/>)/, "g");
        let $ = cheerio.load(text);
        // console.log(text)
        

        var validate: any = {};
        var match;

        validate['__VIEWSTATE'] = $("#__VIEWSTATE").attr("value");
        validate['__EVENTVALIDATION'] = $("#__EVENTVALIDATION").attr("value");
    
        // while ((match = viewPattern.exec(text)) !== null) {
        //     validate['__VIEWSTATE'] = match[2];
        // }
        // while ((match = eventPattern.exec(text)) !== null) {
        //     validate['__EVENTVALIDATION'] = match[2];
        // }
        if(_.isEmpty(validate['__EVENTVALIDATION']) || _.isEmpty(validate['__VIEWSTATE'])){
            throw new Error("Validation alınamadı. Kaynak çalışmıyor olabilir.")
        }
        return validate     
    } catch (err) {
        throw new APIError({
            message : err.message
        })
    }
    
};


function getForm(state: ITapdkRequest, isFile: boolean = false, gun? : any): ITapdkRequest {
    let formData: ITapdkRequest = {
        dd_tarih: <any>TARIH[gun],
        dd_islem: -1,
        TXT_SICIL: "%%",
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
    try {
        const parsePattern = new RegExp("(<([^>]+)>)", "ig");
        const tagPattern = new RegExp("(?=>([^<]+)\r?\n?|\r?$)(.|\n)*?(?=<)", "g");
    
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
    } catch (err) {
        throw new APIError({
            message : "Parse hatası",
            status : httpStatus.NOT_MODIFIED
        })
    }
    
}