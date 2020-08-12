import { ITapdkRequest, TARIH, TARGET } from "./interface/request";
import * as requestPromise from "request-promise";

import * as cheerio from "cheerio";

import { getDistIdsByAdres } from "../controllers/dist.controller";

// const httpStatus = require('http-status');
import * as  httpStatus from "http-status"
const APIError = require('../utils/APIError');

import * as _ from "lodash";
import { parseBayi } from "./bayi";
import { IBayi } from "../../api/interface";
import { removeSpacesFromString } from "./string";
var Iconv = require('iconv').Iconv;

const TAPDK_URL = "http://212.174.130.210/NewTapdk/ViewApp/sorgu.aspx"
export const ruhsatPattern = new RegExp('^[0-9]+(PT|PI|TI|TT|P|AI|N|TE)+$', 'i');
export async function getSourceFromExternal(params : any) {
    let {gun} = params
    try {
        let response;
        try {
            response = await requestPromise.get(TAPDK_URL);
        } catch (error) {
            throw new APIError({
                message : "Kaynakla bağlantı kurulamadı",
                errors : "connection"
            })
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
        

        let finalStates: ITapdkRequest = getStates(response, true);
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
                message : "Belirtilen parametreyle dosya alınamadı",
                status : httpStatus.BAD_REQUEST,
                errors : "connection"
            })
        }

        fileString = removeSpacesFromString(fileString);
        let resultArray = parseFileString(fileString);
        let result = await getArrayFromSource(resultArray)
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

async function getArrayFromSource(resultArray : any[]){
    try {
        let bolgeData : any[] = [];
        const finalResult : [] = resultArray.reduce((_result : IBayi[], val, i, currentArray) => {
            if (val.match(ruhsatPattern)) {
                // Dizi içinde eşleşen `ruhsatNo` indexini alır ve bayi bilgilerinin..
                // ..tamamını alacak şekilde mevcut diziden ilgili diziyi ayırır.
                let chunkArray : any = currentArray.slice(i - 2, i + 7);
    
                let bayi : IBayi = parseBayi(chunkArray);
                
    
                // Bölge listesinde il ve ilçeleri tekil olarak push eder..
                bolgeData = _.unionWith(bolgeData, [bayi.il], _.isEqual)
                _result.push(bayi)
            };
            return _result;
        }, []);


        // Get distId aggregate
        let bolgeResult = await getDistIdsByAdres(bolgeData)

        bolgeResult.map(bolge => {
            let bayiler = _.filter(finalResult, (bayi : IBayi) => 
                            (bayi.il == bolge["il"] && bayi.ilce == bolge["ilce"])
                        );
            bayiler.map(bayi => {
                bayi.distributor = _.union(bayi.distributor, [bolge["distId"]])
                bayi.altBolge = bolge["altBolge"]
            })
        })

        return finalResult
    } catch (err) {
        throw err
    }
    
};

function getStates(text: string, last : boolean = false) {
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
            throw new APIError({
                message : "Validation alınamadı. Kaynak çalışmıyor olabilir.",
                status : httpStatus.NOT_ACCEPTABLE,
                errors : "connection"
            })
        }

        if(last){
            if($("#Button_Print").attr("id") != "Button_Print"){
                throw new APIError({
                    message : "no content",
                    status : httpStatus.NOT_FOUND,
                    errors : "noContent"
                })
            }
        }

        return validate     
    } catch (err) {
        throw err
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

        if(dataArray.length < 1){
            throw new APIError({
                message : "Bayi bulunamadı",
                state : httpStatus.NOT_MODIFIED,
                error : "connection"
            })
        }
        return dataArray      
    } catch (err) {
        throw err
    }
    
}