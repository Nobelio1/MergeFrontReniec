import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./shared/components/main/main.component";
import {GuardianUserGuard} from "./shared/guards/guardian-user.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    component: MainComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(x => x.AuthModule)
  },
  {
    path: 'firmas',
    loadChildren: () => import('./core/firmas/firmas.module').then(x => x.FirmasModule)
  },
  {
    path: 'actas-registrales',
    loadChildren: () => import('./core/actas-registrales/actas-registrales.module').then(x => x.ActasRegistralesModule)
  },
  {
    path: 'seguimiento',
    loadChildren: () => import('./core/seguimiento/seguimiento.module').then(x => x.SeguimientoModule)
  },
  {
    path: 'reportes',
    loadChildren: () => import('./core/reportes/reportes.module').then(x => x.ReportesModule)
  },
  {
    path: 'gestion-solicitudes',
    loadChildren: () => import('./core/gestion-solicitudes/gestion-solicitudes.module').then(x => x.GestionSolicitudesModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
