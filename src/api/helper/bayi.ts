import { IBayi, IBayiIndex } from "../interface";
import { getDistIdsByAdres } from "../controllers/dist.controller";

export async function parseBayi(chunkArray : any[]) : Promise<IBayi>{
    let bayi : IBayi = {
        il : chunkArray[IBayiIndex.İL],
        ilce : chunkArray[IBayiIndex.İLÇE],
        ruhsatNo : chunkArray[IBayiIndex.RUHSAT_NO],
        adi : chunkArray[IBayiIndex.ADI],
        soyadi : chunkArray[IBayiIndex.SOYADI],
        unvan : chunkArray[IBayiIndex.ÜNVAN],
        sinif : chunkArray[IBayiIndex.SINIF],
        adres : chunkArray[IBayiIndex.ADRES],
        durum : chunkArray[IBayiIndex.DURUM],
        distributor : await getDistIdsByAdres(chunkArray[IBayiIndex.İL], chunkArray[IBayiIndex.İLÇE])
    }
    return bayi;
}