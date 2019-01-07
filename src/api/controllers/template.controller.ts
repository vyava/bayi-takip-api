// const MailService = require("@sendgrid/mail")
// import * as MailService from "@sendgrid/mail"

import * as pug from "pug";
const mjml2html = require("mjml")
import * as fs from "fs";
import * as path from "path"

export async function getTemplate() {

    let data = {
            dist : [
                {
                    bolge : "ASYA",
                    dist : "DÜNYA",
                    bayiler : {
                        faal : 5,
                        onay : 1,
                        terk : 1
                    }   
                }
            ],
            tarih : "07.01.2019"
        }

    let viewPath = path.join(__dirname, "../views/email");
    let layoutPath = path.join(viewPath, "layout")
    
    let file = fs.readFileSync(layoutPath+"/yeni-bayi.pug", "utf8")

    let template = pug.compile(file, {
        basedir : viewPath,
        pretty : true
    });

    let compiled = template(data)
    
    const html = mjml2html(compiled);
    return html['html']
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