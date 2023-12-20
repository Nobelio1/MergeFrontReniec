import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reporte-excel',
  templateUrl: './reporte-excel.component.html',
  styleUrls: ['./reporte-excel.component.css']
})
export class ReporteExcelComponent implements OnInit {
environment: any;
  constructor() { }

  ngOnInit(): void {
    this.environment = environment;
  }

}
