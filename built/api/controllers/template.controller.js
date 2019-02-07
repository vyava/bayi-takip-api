"use strict";
// const MailService = require("@sendgrid/mail")
// import * as MailService from "@sendgrid/mail"
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pug = require("pug");
const mjml2html = require("mjml");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const html_interface_1 = require("../helper/interface/html.interface");
function getTemplate(templateName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { viewFileName, fileParams } = getTemplateParams(templateName);
            let htmlData = {
                header: fileParams["header"],
                fileData: data,
                tarih: "07.01.2019"
            };
            console.log(htmlData);
            let viewPath = path.join(__dirname, "../views/email");
            let layoutPath = path.join(viewPath, "layout");
            let filePath = path.join(layoutPath, viewFileName);
            let file = fs.readFileSync(filePath, "utf8");
            let template = pug.compile(file, {
                basedir: viewPath,
                pretty: true
            });
            let compiled = template(htmlData);
            const html = mjml2html(compiled);
            return html['html'];
        }
        catch (err) {
            return err;
        }
    });
}
exports.getTemplate = getTemplate;
function getTemplateParams(templateName) {
    if (_.isEmpty(html_interface_1.VIEW_PARAMS[templateName])) {
        throw new Error(`Template parametre bulunamadı : ${templateName}`);
    }
    else {
        return html_interface_1.VIEW_PARAMS[templateName];
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
