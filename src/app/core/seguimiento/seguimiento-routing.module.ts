import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SeguimientoDashboardComponent} from "./components/seguimiento-dashboard/seguimiento-dashboard.component";
import {SeguimientoValidacionComponent} from "./components/seguimiento-validacion/seguimiento-validacion.component";
import {SeguimientoBusquedaComponent} from "./components/seguimiento-busqueda/seguimiento-busqueda.component";
import {GuardianUserGuard} from "../../shared/guards/guardian-user.guard";

const routes: Routes = [
  {
    path: '',
    component: SeguimientoDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'validacion',
        pathMatch: 'full'
      },
      {
        path: 'validacion',
        component: SeguimientoValidacionComponent
      },
      {
        path: 'busqueda',
        component: SeguimientoBusquedaComponent,
        canActivate: [GuardianUserGuard]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguimientoRoutingModule { }
