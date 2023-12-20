import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GsBusquedaComponent} from "./components/gs-busqueda/gs-busqueda.component";
import {GsDashboardComponent} from "./components/gs-dashboard/gs-dashboard.component";
import {GuardianUserInternalGuard} from "../../shared/guards/guardian-user-internal.guard";
import {GsAtencionComponent} from "./components/gs-atencion/gs-atencion.component";

const routes: Routes = [
  {
    path: '',
    component: GsDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'busqueda',
        pathMatch: 'full'
      },
      {
        path: 'busqueda',
        component: GsBusquedaComponent,
        canActivate: [GuardianUserInternalGuard]
      },
      {
        path: 'atencion/:id',
        component: GsAtencionComponent,
        canActivate: [GuardianUserInternalGuard]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionSolicitudesRoutingModule { }
