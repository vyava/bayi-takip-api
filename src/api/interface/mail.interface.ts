import { Mail } from "./user.interface";

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