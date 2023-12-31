import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionSolicitudesRoutingModule } from './gestion-solicitudes-routing.module';
import { GsBusquedaComponent } from './components/gs-busqueda/gs-busqueda.component';
import { GsDashboardComponent } from './components/gs-dashboard/gs-dashboard.component';
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AppMaterialModule} from "../../app-material.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {MastersModule} from "../../masters/masters.module";
import { GsAnalistaComponent } from './components/gs-analista/gs-analista.component';
import { GsDetalleComponent } from './components/gs-detalle/gs-detalle.component';
import { GsDetalleFilesComponent } from './components/gs-detalle-files/gs-detalle-files.component';
import { GsAtencionComponent } from './components/gs-atencion/gs-atencion.component';
import {ActasRegistralesModule} from "../actas-registrales/actas-registrales.module";
import { GsEditarComponent } from './components/gs-editar/gs-editar.component';
import { GsDetalleFilesEditarComponent } from './components/gs-detalle-files-editar/gs-detalle-files-editar.component';

@NgModule({
  declarations: [
    GsBusquedaComponent,
    GsDashboardComponent,
    GsAnalistaComponent,
    GsDetalleComponent,
    GsDetalleFilesComponent,
    GsAtencionComponent,
    GsEditarComponent,
    GsDetalleFilesEditarComponent,
  ],
  imports: [
    CommonModule,
    GestionSolicitudesRoutingModule,
    ReactiveFormsModule,
    AppMaterialModule,
    NgxSpinnerModule,
    SharedModule,
    MastersModule,
    ActasRegistralesModule
  ],
  exports: [
    GsAnalistaComponent
  ]
})
export class GestionSolicitudesModule { }
