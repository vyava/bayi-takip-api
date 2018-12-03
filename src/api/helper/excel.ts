// import * as tempfile from 'tempfile';
import * as Excel from "exceljs"

export function addValuesToWorksheet(columns : string[], values : any[]){
    try {
        let _workbook = new Excel.Workbook();
        _workbook.creator = "Zafer Genç"
        let _worksheet = _workbook.addWorksheet("Sayfa 1");
        _worksheet.addRow(values);
        return _worksheet;
    } catch (err) {
        throw new Error("Excel dosyası oluşturulamadı.")
    }
}