import { Document } from "mongoose";


export interface IBayiDocument extends Document, IBayi { };

export interface IBayi {
  il?: string;
  ilce?: string;
  ruhsatNo?: string;
  adi?: string;
  soyadi?: string;
  unvan?: string;
  sinif?: string;
  adres?: string;
  durum?: string;
  distributor? : any;
}