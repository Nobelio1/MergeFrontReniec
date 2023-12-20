import { NgModule } from '@angular/core';
import { ReporteExcelComponent } from './components/reporte-excel/reporte-excel.component';
import { CommonModule } from '@angular/common';
import { ReportesRoutingModule } from './reportes-routing.module';
import { AppMaterialModule } from '../../app-material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MastersModule } from '../../masters/masters.module';
import { ReportesDashboardComponent } from './components/reportes-dashboard/reportes-dashboard.component';

@NgModule({
  declarations: [
    // Otros componentes declarados anteriormente

    ReporteExcelComponent,
    ReportesDashboardComponent,
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    AppMaterialModule,
    NgxSpinnerModule,
    SharedModule,
    MastersModule,
    ReactiveFormsModule,
  ],
  // ... otros imports y configuraciones
})
export class ReportesModule {}
