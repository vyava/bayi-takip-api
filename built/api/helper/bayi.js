"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("../interface");
const DEFUALT_RUHSAT = "01BAK";
const RUHSAT_TIP = {
    "AKARYAKIT - OTOGAZ İSTASYONU İÇİ AÇIK ALKOLLÜ İÇKİ SATIŞ NOKTASI": "07BEN",
    "AKARY-OTOG.İSTASYONU İÇİ PER. SAT. NOKTASI": "07BEN",
    "ASKERİ KANTİN": "08ASK",
    "BAKKAL": "01BAK",
    "BAR, GECE KULÜBÜ": "09DIG",
    "BÜFE": "03BFE",
    "DENİZ TAŞITI": "09DIG",
    "DERNEK LOKALİ": "09DIG",
    "HİPERMARKET": "12YZNC",
    "İÇKİLİ LOKANTA": "09DIG",
    "KANTİN": "09DIG",
    "KAMU KURUMU (SOS.TES./KANTİN)": "09DIG",
    "KONAKLAMA TESİSİ": "09DIG",
    "KURUYEMİŞÇİ": "04KYE",
    "MARKET": "02MAR",
    "MÜSTAKİL TÜTÜN MAM./ALKOLLÜ İÇKİ SATICILIĞI": "09DIG",
    "NARGİLE KAFE": "09DIG",
    "ORDUEVİ - ASKERİ GAZİNO": "08ASK",
    "SATIŞ KOOPERATİFİ": "09DIG",
    "SÜPERMARKET": "02MAR",
    "ŞARKÜTERİ": "02MAR",
    "TOPTAN SATICI": "13TOPT"
};
function parseBayi(chunkArray) {
    let _ruhsat = chunkArray[interface_1.IBayiIndex.RUHSAT_NO];
    let { ruhsatTip, ruhsatNo } = parseRuhsat(_ruhsat);
    try {
        let bayi = {
            il: chunkArray[interface_1.IBayiIndex.İL],
            ilce: chunkArray[interface_1.IBayiIndex.İLÇE],
            ruhsatNo: ruhsatNo + '' + ruhsatTip,
            ruhsatTipleri: ruhsatTip,
            adi: chunkArray[interface_1.IBayiIndex.ADI],
            soyadi: chunkArray[interface_1.IBayiIndex.SOYADI],
            adiSoyadi: chunkArray[interface_1.IBayiIndex.ADI] + " " + chunkArray[interface_1.IBayiIndex.SOYADI],
            unvan: chunkArray[interface_1.IBayiIndex.ÜNVAN],
            sinif: chunkArray[interface_1.IBayiIndex.SINIF],
            sinifDsd: RUHSAT_TIP[chunkArray[interface_1.IBayiIndex.SINIF]] || DEFUALT_RUHSAT,
            adres: chunkArray[interface_1.IBayiIndex.ADRES],
            durum: chunkArray[interface_1.IBayiIndex.DURUM]
        };
        return bayi;
    }
    catch (err) {
        throw new Error("Parse işlemi yapılamadı");
    }
}
exports.parseBayi = parseBayi;
function parseRuhsat(ruhsat) {
    const ruhsatPattern = new RegExp('^([0-9]+)(PT|PI|TI|TT|P|AI|N|TE)+$', 'i');
    let { ruhsatNo, ruhsatTip } = { ruhsatNo: null, ruhsatTip: null };
    ruhsatNo = ruhsat.match(ruhsatPattern)[1];
    ruhsatTip = ruhsat.match(ruhsatPattern)[2];
    return { ruhsatNo, ruhsatTip };
}
