import { Document } from "mongoose";
import { IDistributor, IDistributorDocument } from "./distributor.interface";


export interface IBayiDocument extends Document, IBayi { };

export interface IBayi {
    il?           : string;
    ilce?         : string;
    ruhsatNo?     : string;
    adi?          : string;
    soyadi?       : string;
    unvan?        : string;
    sinif?        : string;
    adres?        : string;
    durum?        : string;
    distributor?  : IDistributorDocument[];
    timestamp?    : string;
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