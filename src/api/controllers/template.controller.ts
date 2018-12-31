// const MailService = require("@sendgrid/mail")
import * as MailService from "@sendgrid/mail"

export async function setWithTemplate(){
    // MailService.setSubstitutionWrappers('{{', '}}');

    return await MailService.send([
        {
          from : "tapdk@asstan.net",
          templateId : "d-611118cc93654b41a465ca99fb6bc2a3",
          personalizations : [
            {
                subject : "Subject Deneme",
                to : [
                    {
                        email : "zafergenc02@gmail.com",
                        name : "Zafer GENÇ"
                    },
                ],
                dynamic_template_data : {
                    content : {
                        name : "Yeni Bayiler"
                    },
                    data : [
                        {
                            name : "Test1"
                        },
                        {
                            name : "Test2"
                        }
                    ]
                }
            }
          ],
          
        }
    ])
}