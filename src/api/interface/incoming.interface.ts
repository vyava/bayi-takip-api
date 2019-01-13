
export interface IInBound {
    fields : InBoundFields
    files? : {
        [attachment : string] : InBoundAttachment
    }
}
interface InBoundFields {
    headers : string;
    dkim : string;
    "content-ids" : string;
    to : string;
    html? : string;
    from : string;
    text? : string;
    sender_ip : string;
    envelope : string;
    attachments? : string;
    subject? : string;
    "attachment-info" : string;
    charsets? : string;
    SPF? : string;
}
interface InBoundAttachment {
    
        size : number;
        path : string;
        name : string;
        type : string;
        mtime : string;
}
