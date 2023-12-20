import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesDetalleRoutingModule } from './reportes-detalle-routing.module';
import { RdDashboardComponent } from './components/rd-dashboard/rd-dashboard.component';
import { RdReporteDetalleComponent } from './components/rd-reporte-detalle/rd-reporte-detalle.component';
import { RdDetalleFilesComponent } from './components/rd-detalle-files/rd-detalle-files.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppMaterialModule } from 'src/app/app-material.module';
import { MastersModule } from 'src/app/masters/masters.module';

@NgModule({
  declarations: [
    RdDashboardComponent,
    RdReporteDetalleComponent,
    RdDetalleFilesComponent,
  ],
  imports: [
    CommonModule,
    ReportesDetalleRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    AppMaterialModule,
    NgxSpinnerModule,
    SharedModule,
    MastersModule,
  ],
})
export class ReportesDetalleModule {}
