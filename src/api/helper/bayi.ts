import { IBayi, IBayiIndex } from "../interface";

const DEFUALT_RUHSAT = "01BAK";
const RUHSAT_TIP = {
    "AKARYAKIT - OTOGAZ İSTASYONU İÇİ AÇIK ALKOLLÜ İÇKİ SATIŞ NOKTASI" : "07BEN",
    "AKARY-OTOG.İSTASYONU İÇİ PER. SAT. NOKTASI" : "07BEN",
    "ASKERİ KANTİN" : "08ASK",
    "BAKKAL" : "01BAK",
    "BAR, GECE KULÜBÜ" : "09DIG",
    "BÜFE" : "03BFE",
    "DENİZ TAŞITI" : "09DIG",
    "DERNEK LOKALİ" : "09DIG",
    "HİPERMARKET" : "12YZNC",
    "İÇKİLİ LOKANTA" : "09DIG",
    "KANTİN" : "09DIG",
    "KAMU KURUMU (SOS.TES./KANTİN)" : "09DIG",
    "KONAKLAMA TESİSİ" : "09DIG",
    "KURUYEMİŞÇİ" : "04KYE",
    "MARKET" : "02MAR",
    "MÜSTAKİL TÜTÜN MAM./ALKOLLÜ İÇKİ SATICILIĞI" : "09DIG",
    "NARGİLE KAFE" : "09DIG",
    "ORDUEVİ - ASKERİ GAZİNO" : "08ASK",
    "SATIŞ KOOPERATİFİ" : "09DIG",
    "SÜPERMARKET" : "02MAR",
    "ŞARKÜTERİ" : "02MAR",
    "TOPTAN SATICI" : "13TOPT"
}

export function parseBayi(chunkArray : any[]) : IBayi{
    let _ruhsat = chunkArray[IBayiIndex.RUHSAT_NO];
    let {ruhsatTip, ruhsatNo} = parseRuhsat(_ruhsat)
    try {
        let bayi : IBayi = {
            il : chunkArray[IBayiIndex.İL],
            ilce : chunkArray[IBayiIndex.İLÇE],
            ruhsatNo : ruhsatNo+''+ruhsatTip,
            ruhsatTipleri : ruhsatTip,
            adi : chunkArray[IBayiIndex.ADI],
            soyadi : chunkArray[IBayiIndex.SOYADI],
            adiSoyadi : chunkArray[IBayiIndex.ADI]+" "+ chunkArray[IBayiIndex.SOYADI],
            unvan : chunkArray[IBayiIndex.ÜNVAN],
            sinif : chunkArray[IBayiIndex.SINIF],
            sinifDsd : RUHSAT_TIP[chunkArray[IBayiIndex.SINIF]] || DEFUALT_RUHSAT,
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
    ruhsatTip = ruhsat.match(ruhsatPattern)[2];
    
    return {ruhsatNo, ruhsatTip}
}