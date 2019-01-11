import { Document, Types } from "mongoose";
import { IDistributor, IDistributorDocument } from "./distributor.interface";


export interface IBayiDocument extends Document, IBayi { };

export interface IBayi {
    il?           : string;
    ilce?         : string;
    ruhsatNo?     : string;
    ruhsatTipleri?: string[] | string
    adi?          : string;
    soyadi?       : string;
    adiSoyadi?    : string;
    unvan?        : string;
    sinif?        : string;
    sinifDsd?     : string;
    adres?        : string;
    durum?        : string;
    createdAt?    : string;
    updatedAt?    : string;
    distributor?  : Types.ObjectId[] | [{name : string}];
    altBolge?     : string;
}

export enum IBayiIndex {
    İL            = 0,
    İLÇE,
    RUHSAT_NO,
    ADI,
    SOYADI,
    ÜNVAN,
    SINIF,
    ADRES,
    DURUM  
}