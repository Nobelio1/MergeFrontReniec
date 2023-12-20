import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteExcelComponent } from './components/reporte-excel/reporte-excel.component';
import { ReportesDashboardComponent } from './components/reportes-dashboard/reportes-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: ReportesDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'reportes',
        pathMatch: 'full',
      },
      {
        path: 'reportes',
        component: ReporteExcelComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule {}
