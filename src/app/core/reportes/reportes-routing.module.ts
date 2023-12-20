import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteExcelComponent } from './components/reporte-excel/reporte-excel.component';
import {GuardianUserGuard} from "../../shared/guards/guardian-user.guard";

const routes: Routes = [
  // Otras rutas declaradas anteriormente
  {
      path: '',
      component: ReporteExcelComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
