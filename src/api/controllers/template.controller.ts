// const MailService = require("@sendgrid/mail")
// import * as MailService from "@sendgrid/mail"

import * as handlebars from "handlebars";
const mjml2html = require("mjml")
import * as fs from "fs";
import * as path from "path"

export async function getTemplate() {

    let viewPath = path.join(__dirname, "../views/email");
    let layoutPath = path.join(viewPath, "layout")
    let partialsPath = path.join(viewPath, "partials/header.mjml")
    console.log(viewPath)
    let file = fs.readFileSync(layoutPath+"/yeni-bayi.mjml", "utf8")

    // let template = handlebars.compile(file);

    // const context = {
    //     message: 'Hello World'
    // };
    // const mjml = template(context);
    const html = mjml2html(file, {filePath : partialsPath});
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