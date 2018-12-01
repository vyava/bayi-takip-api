import { IBayi, IBayiIndex } from "../interface";


export function parseBayi(chunkArray : any[]) : IBayi{
    let bayi : IBayi = {
        il : chunkArray[IBayiIndex.İL],
        ilce : chunkArray[IBayiIndex.İLÇE],
        ruhsatNo : chunkArray[IBayiIndex.RUHSAT_NO],
        adiSoyadi : chunkArray[IBayiIndex.ADI]+" "+ chunkArray[IBayiIndex.SOYADI],
        adi : chunkArray[IBayiIndex.ADI],
        soyadi : chunkArray[IBayiIndex.SOYADI],
        unvan : chunkArray[IBayiIndex.ÜNVAN],
        sinif : chunkArray[IBayiIndex.SINIF],
        adres : chunkArray[IBayiIndex.ADRES],
        durum : chunkArray[IBayiIndex.DURUM],
        sended : false
    }
    return bayi;
}