import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RpDashboardComponent } from './components/rp-dashboard/rp-dashboard.component';
import { RpReporteComponent } from './components/rp-reporte/rp-reporte.component';
import { GuardianUserInternalGuard } from 'src/app/shared/guards/guardian-user-internal.guard';

const routes: Routes = [
  {
    path: '',
    component: RpDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'rpexcel',
        pathMatch: 'full',
      },
      {
        path: 'rpexcel',
        component: RpReporteComponent,
        canActivate: [GuardianUserInternalGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesExcelRoutingModule {}
