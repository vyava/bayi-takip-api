import { Mail } from "./user.interface";

export interface RequestOptions {
    limit : number;
    select : [];
}

export interface DistRequest {
    il : string;
    ilce : string;
};

export interface NewDist {
    bolge : string;
    bolgeKod: number;
    bolgeler : string;
    cc : Mail[];
    to : Mail[];
    kod : number;
    name : string;
    status : boolean;

}