import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LibroDashboardComponent} from "./components/libro-dashboard/libro-dashboard.component";
import {LibroValidacionComponent} from "./components/libro-validacion/libro-validacion.component";
import {LibroRegistroComponent} from "./components/libro-registro/libro-registro.component";
import {GuardianUserGuard} from "../../shared/guards/guardian-user.guard";

const routes: Routes = [
  {
    path: '',
    component: LibroDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'validacion',
        pathMatch: 'full'
      },
      {
        path: 'validacion',
        component: LibroValidacionComponent
      },
      {
        path: 'registro',
        component: LibroRegistroComponent,
        canActivate: [GuardianUserGuard]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActasRegistralesRoutingModule { }
