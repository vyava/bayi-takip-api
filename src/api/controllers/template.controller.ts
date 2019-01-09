// const MailService = require("@sendgrid/mail")
// import * as MailService from "@sendgrid/mail"

import * as pug from "pug";
const mjml2html = require("mjml")
import * as _ from "lodash"
import * as fs from "fs";
import * as path from "path"
import { VIEW_PARAMS  } from "../helper/interface/html.interface";

export async function getTemplate(templateName : string, data) {
    try {
        let {viewFileName, fileParams} = getTemplateParams(templateName);
        let htmlData = {
                header : fileParams["header"],
                fileData : data,
                tarih : "07.01.2019"
            }
            console.log(htmlData)
        let viewPath = path.join(__dirname, "../views/email");
        let layoutPath = path.join(viewPath, "layout");
        let filePath = path.join(layoutPath, viewFileName);
        
        let file = fs.readFileSync(filePath, "utf8")

        let template = pug.compile(file, {
            basedir : viewPath,
            pretty : true
        });

        let compiled = template(htmlData)
        
        const html = mjml2html(compiled);
        return html['html']
    } catch (err) {
        return err;
    }
    
}

function getTemplateParams(templateName : string){
    if(_.isEmpty(VIEW_PARAMS[templateName])){
        throw new Error(`Template parametre bulunamadı : ${templateName}`);
    }else{
        return VIEW_PARAMS[templateName]
    }
}


// export async function setWithTemplate(){
//     // MailService.setSubstitutionWrappers('{{', '}}');

//     return await MailService.send([
//         {
//           from : "tapdk@asstan.net",
//           templateId : "d-611118cc93654b41a465ca99fb6bc2a3",
//           personalizations : [
//             {
//                 subject : "Subject Deneme",
//                 to : [
//                     {
//                         email : "zafergenc02@gmail.com",
//                         name : "Zafer GENÇ"
//                     },
//                 ],
//                 dynamic_template_data : {
//                     content : {
//                         name : "Yeni Bayiler"
//                     },
//                     data : [
//                         {
//                             name : "Test1"
//                         },
//                         {
//                             name : "Test2"
//                         }
//                     ]
//                 }
//             }
//           ],

//         }
//     ])
// }