// import * as tempfile from 'tempfile';
import * as Excel from "exceljs";
import * as tempfile from "tempfile"

enum HEADER {
    altBolge = "Bölge",
    distributor = "Dist",
    createdAt = "Kayıt Tarihi",
    updatedAt = "Güncelleme Tarihi",
    ruhsatNo = "Ruhat No",
    adiSoyadi = "Adı-Soyadı",
    unvan = "Ünvan",
    il = "İl",
    ilce = "İlçe",
    adres = "Adres",
    sinif = "Sınıf",
    durum = "Durum"
}

export function addValuesToWorksheet(columns : string[], values : any[], options? : any){
    try {
        let _workbook = new Excel.Workbook();
        let _worksheet = _workbook.addWorksheet("Sayfa 1");
        _worksheet.columns = []
        let _column = columns.map((key : any) => {
            return {
                header : HEADER[key],
                key : key
            }
        });
        _worksheet.columns = _column;
        values.map(value => {
            _worksheet.addRow(value);
        })
        
        let tempPath = tempfile(".xlsx");
        return _workbook.xlsx.writeFile(tempPath)
            .then(data => {
                console.log(tempPath)
                return tempPath
            })
            .catch(err => {
                throw err
            })
    } catch (err) {
        throw new Error(err)
    }
}