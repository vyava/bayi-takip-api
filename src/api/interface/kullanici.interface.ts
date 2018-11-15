export interface Kullanici {
    firstName : string;
    lastName : string;
    fullName : string;
    email : {
        address : string;
        name : string;
    };
    status : boolean;
}

export interface IDSM extends Kullanici {
    area : string;
    taskName : string;
    distributor : string;
}

export interface ITTE extends Kullanici {
    area : string;
    taskName : string;
    distributor : string;
}

export interface IOperator extends Kullanici {
    area : string;
    taskName : string;
    distributor : string;
}

export interface IRSM extends Kullanici {
    area : string[];
    taskName : string;
    distributor : string;
}