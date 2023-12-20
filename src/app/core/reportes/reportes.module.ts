import { NgModule } from '@angular/core';
import { ReporteExcelComponent } from './components/reporte-excel/reporte-excel.component';
import { CommonModule } from '@angular/common';
import { ReportesRoutingModule } from './reportes-routing.module';
import {AppMaterialModule} from "../../app-material.module";
import {NgxSpinnerModule} from "ngx-spinner";

import {SharedModule} from "../../shared/shared.module";
import {MastersModule} from "../../masters/masters.module";

@NgModule({
  declarations: [
    // Otros componentes declarados anteriormente

    ReporteExcelComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    AppMaterialModule,
    NgxSpinnerModule,
    SharedModule,
    MastersModule
  ]
  // ... otros imports y configuraciones
})
export class ReportesModule { }
