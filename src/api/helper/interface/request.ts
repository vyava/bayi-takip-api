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
    BUGÜN = 1,
    DÜN = 2,
    SON_7_GÜN = 3,
    SON_15_GÜN = 4,
    SON_30_GÜN = 5
}

export enum TARGET {
    FILE = "Button_Print",
    DROP = "DropDownList_CountViewGrid"
}