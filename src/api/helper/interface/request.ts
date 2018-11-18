export interface ITapdkRequest {
    __VIEWSTATE? : string;
    __EVENTVALIDATION? : string;
    __EVENTTARGET? : TARGET.DROP | TARGET.FILE;
    dd_il? : number;
    dd_tarih? : number;
    dd_islem? : number;
    TXT_SICIL? : string;
    DropDownList_CountViewGrid? : number
}

export enum TARIH {
    TAMAMI = 0,
    BUGÜN,
    DÜN,
    SON_7_GÜN,
    SON_15_GÜN,
    SON_30_GÜN
}

export enum TARGET {
    FILE = "Button_Print",
    DROP = "DropDownList_CountViewGrid"
}