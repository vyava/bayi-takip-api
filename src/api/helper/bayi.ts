import { IBayi, IBayiIndex } from "../interface";


export function parseBayi(chunkArray : any[]) : IBayi{
    let _ruhsat = chunkArray[IBayiIndex.RUHSAT_NO];
    let {ruhsatTip, ruhsatNo} = parseRuhsat(_ruhsat)
    try {
        let bayi : IBayi = {
            il : chunkArray[IBayiIndex.İL],
            ilce : chunkArray[IBayiIndex.İLÇE],
            ruhsatNo : ruhsatNo,
            ruhsatTipleri : ruhsatTip,
            adiSoyadi : chunkArray[IBayiIndex.ADI]+" "+ chunkArray[IBayiIndex.SOYADI],
            adi : chunkArray[IBayiIndex.ADI],
            soyadi : chunkArray[IBayiIndex.SOYADI],
            unvan : chunkArray[IBayiIndex.ÜNVAN],
            sinif : chunkArray[IBayiIndex.SINIF],
            adres : chunkArray[IBayiIndex.ADRES],
            durum : chunkArray[IBayiIndex.DURUM]
        }
        return bayi; 
    } catch (err) {
        throw new Error("Parse işlemi yapılamadı")
    }
    
}

function parseRuhsat(ruhsat : string){
    const ruhsatPattern = new RegExp('^([0-9]+)(PT|PI|TI|TT|P|AI|N)+$', 'i');

    let {ruhsatNo, ruhsatTip} = {ruhsatNo : null, ruhsatTip : null};

    ruhsatNo = ruhsat.match(ruhsatPattern)[1];
    ruhsatTip = [ruhsat.match(ruhsatPattern)[2]];
    
    return {ruhsatNo, ruhsatTip}
}