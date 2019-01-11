import { Mail, IUserPayload } from "./user.interface";
import { IBayi } from "./bayi.interface";

export interface IMailPayload {
    file : any;
    from? : Mail[];
    to : Mail[];
    cc : Mail[];
    subject : string;
    text? : string;
    html? : string;
    attachments : IAttachment[] | IAttachment;
    sendAt? : number;
}

interface IAttachment {
    content: any;
    filename: string;
    type?: string;
    disposition?: string;
    content_id?: string;
};

export interface IBolgeMailData {
    _id     : string;
    bayiler : [IBayi];
    users   : [IUserPayload];
    data    : any;
}