import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FirmaDashboardComponent} from "./components/firma-dashboard/firma-dashboard.component";
import {FirmaValidacionComponent} from "./components/firma-validacion/firma-validacion.component";
import {FirmaRegistroComponent} from "./components/firma-registro/firma-registro.component";
import {GuardianUserGuard} from "../../shared/guards/guardian-user.guard";

const routes: Routes = [
  {
    path: '',
    component: FirmaDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'validacion',
        pathMatch: 'full'
      },
      {
        path: 'validacion',
        component: FirmaValidacionComponent
      },
      {
        path: 'registro',
        component: FirmaRegistroComponent,
        canActivate: [GuardianUserGuard]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirmasRoutingModule { }
