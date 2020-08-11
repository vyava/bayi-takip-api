import { Mail } from "./user.interface";

export interface RequestOptions {
    limit : number;
    select : [];
}

export interface DistRequest {
    il : string[] | string;
    ilce : string[] | string;
};

export interface NewDist {
    altBolge : string;
    bolgeKod: number;
    bolge : string;
    cc : Mail[];
    to : Mail[];
    kod : number;
    name : string;
    status : boolean;

}