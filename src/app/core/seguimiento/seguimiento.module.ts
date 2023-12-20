import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguimientoRoutingModule } from './seguimiento-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {AppMaterialModule} from "../../app-material.module";
import {NgxSpinnerModule} from "ngx-spinner";
import { SeguimientoDashboardComponent } from './components/seguimiento-dashboard/seguimiento-dashboard.component';
import { SeguimientoValidacionComponent } from './components/seguimiento-validacion/seguimiento-validacion.component';
import { SeguimientoBusquedaComponent } from './components/seguimiento-busqueda/seguimiento-busqueda.component';
import {SharedModule} from "../../shared/shared.module";
import {MastersModule} from "../../masters/masters.module";
import { ModalDocumentosComponent } from './components/modal-documentos/modal-documentos.component';

@NgModule({
  declarations: [
    SeguimientoDashboardComponent,
    SeguimientoValidacionComponent,
    SeguimientoBusquedaComponent,
    ModalDocumentosComponent
  ],
  imports: [
    CommonModule,
    SeguimientoRoutingModule,
    ReactiveFormsModule,
    AppMaterialModule,
    NgxSpinnerModule,
    SharedModule,
    MastersModule
  ]
})
export class SeguimientoModule { }
