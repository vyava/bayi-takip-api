import { IUserPayload } from "../../../api/interface";

export interface IncomingPayload {
    to?             : string[];
    cc?             : string[];
    subject?        : string;
    filesLength?    : number;
    attachments?    : Attachment[]
    senderIp?       : string;
    from?           : IUserPayload;
    received?       : string[];
};

export interface Attachment {
    filename        : string;
    name            : string;
    type            : string;
    "content-id"    : string;
}