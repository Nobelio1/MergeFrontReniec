import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RdDashboardComponent } from './components/rd-dashboard/rd-dashboard.component';
import { RdReporteDetalleComponent } from './components/rd-reporte-detalle/rd-reporte-detalle.component';
import { GuardianUserInternalGuard } from 'src/app/shared/guards/guardian-user-internal.guard';

const routes: Routes = [
  {
    path: '',
    component: RdDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'detalle',
        pathMatch: 'full',
      },
      {
        path: 'detalle',
        component: RdReporteDetalleComponent,
        canActivate: [GuardianUserInternalGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesDetalleRoutingModule {}
