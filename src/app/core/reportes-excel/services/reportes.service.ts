import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { MatTableDataSource } from '@angular/material/table';
import { ReporteData } from '../../gestion-solicitudes/models/busquedaReporte.model';

@Injectable({
  providedIn: 'root',
})
export class ExcelExportService {
  constructor() {}

  exportToExcel(
    dataSource: MatTableDataSource<ReporteData>,
    excelFileName: string
  ): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Obtén las columnas de la fuente de datos
    const columns =
      dataSource.data.length > 0 ? Object.keys(dataSource.data[0]) : [];

    // Añade encabezados de columna a la hoja de cálculo
    worksheet.addRow(columns);

    // Añade datos a la hoja de cálculo
    dataSource.data.forEach((row: any, index: number) => {
      const values = columns.map((column) => row[column]);
      const excelRow = worksheet.addRow(values);
    });

    // Guarda el archivo Excel
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      this.saveAsExcel(buffer, excelFileName);
    });
  }

  private saveAsExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = `${fileName}.xlsx`;
    link.click();
  }
}
