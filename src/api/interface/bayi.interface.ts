import { Document, Types } from "mongoose";
import { IDistributor, IDistributorDocument } from "./distributor.interface";


export interface IBayiDocument extends Document, IBayi { };

export interface IBayi {
    il?           : string;
    ilce?         : string;
    ruhsatNo?     : string;
    adiSoyadi?    : string;
    adi?          : string;
    soyadi?       : string;
    unvan?        : string;
    sinif?        : string;
    adres?        : string;
    durum?        : string;
    distributor?  : Types.ObjectId[];
    timestamp?    : string;
    altBolge?     : string;
    ruhsatTipleri?: [string]
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