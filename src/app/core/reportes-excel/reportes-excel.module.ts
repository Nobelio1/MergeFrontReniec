import { NgModule } from '@angular/core';
import { RpDashboardComponent } from './components/rp-dashboard/rp-dashboard.component';
import { RpReporteComponent } from './components/rp-reporte/rp-reporte.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppMaterialModule } from 'src/app/app-material.module';
import { MastersModule } from 'src/app/masters/masters.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportesExcelRoutingModule } from './reportes-excel-routing.module';
import { RpDetalleComponent } from './components/rp-detalle/rp-detalle.component';
import { RpDetalleFilesComponent } from './components/rp-detalle-files/rp-detalle-files.component';
import { RpDocumentoComponent } from './components/rp-documento/rp-documento.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppMaterialModule,
    NgxSpinnerModule,
    SharedModule,
    MastersModule,
    ReportesExcelRoutingModule,
  ],
  exports: [],
  declarations: [RpDashboardComponent, RpReporteComponent, RpDetalleComponent, RpDetalleFilesComponent, RpDocumentoComponent],
})
export class ReportesExcelModule {}
