import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {AppMaterialModule} from "../app-material.module";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import { ValidacionDatosComponent } from './components/validacion-datos/validacion-datos.component';
import { DatosOficinaAutorizadaComponent } from './components/datos-oficina-autorizada/datos-oficina-autorizada.component';
import { UbigeoComponent } from './components/ubigeo/ubigeo.component';
import { CentroProbladoComponent } from './components/centro-problado/centro-problado.component';
import { ComunidadComponent } from './components/comunidad/comunidad.component';
import { OficinaAuxiliarComponent } from './components/oficina-auxiliar/oficina-auxiliar.component';
import { AgenciaComponent } from './components/agencia/agencia.component';
import { OficinaAutorizadaComponent } from './components/oficina-autorizada/oficina-autorizada.component';
import { TipoSolicitudComponent } from './components/tipo-solicitud/tipo-solicitud.component';
import { OptionsComponent } from './components/options/options.component';

@NgModule({
  declarations: [
    ValidacionDatosComponent,
    DatosOficinaAutorizadaComponent,
    UbigeoComponent,
    CentroProbladoComponent,
    ComunidadComponent,
    OficinaAuxiliarComponent,
    AgenciaComponent,
    OficinaAutorizadaComponent,
    TipoSolicitudComponent,
    OptionsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AppMaterialModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    ValidacionDatosComponent,
    DatosOficinaAutorizadaComponent,
    UbigeoComponent,
    CentroProbladoComponent,
    ComunidadComponent,
    OficinaAuxiliarComponent,
    AgenciaComponent,
    OficinaAutorizadaComponent,
    TipoSolicitudComponent,
    OptionsComponent,
  ]
})
export class MastersModule { }
