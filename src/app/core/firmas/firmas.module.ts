import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FirmasRoutingModule } from './firmas-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {AppMaterialModule} from "../../app-material.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../shared/shared.module";
import { FirmaDashboardComponent } from './components/firma-dashboard/firma-dashboard.component';
import { FirmaValidacionComponent } from './components/firma-validacion/firma-validacion.component';
import { FirmaRegistroComponent } from './components/firma-registro/firma-registro.component';
import {MastersModule} from "../../masters/masters.module";
import { Step1DatosSolicitanteComponent } from './components/step1-datos-solicitante/step1-datos-solicitante.component';
import { Step2DatosSolicitudComponent } from './components/step2-datos-solicitud/step2-datos-solicitud.component';
import { Step3SolicitudGeneradaComponent } from './components/step3-solicitud-generada/step3-solicitud-generada.component';
import { Step2DetalleSolicitudComponent } from './components/step2-detalle-solicitud/step2-detalle-solicitud.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ValidacionRegCivilModalComponent } from './components/validacion-reg-civil-modal/validacion-reg-civil-modal.component';

@NgModule({
  declarations: [
    FirmaDashboardComponent,
    FirmaValidacionComponent,
    FirmaRegistroComponent,
    Step1DatosSolicitanteComponent,
    Step2DatosSolicitudComponent,
    Step3SolicitudGeneradaComponent,
    Step2DetalleSolicitudComponent,
    ConfirmationModalComponent,
    ValidacionRegCivilModalComponent
  ],
  exports: [
    Step1DatosSolicitanteComponent,
    Step3SolicitudGeneradaComponent
  ],
  imports: [
    CommonModule,
    FirmasRoutingModule,
    ReactiveFormsModule,
    AppMaterialModule,
    NgxSpinnerModule,
    SharedModule,
    MastersModule
  ]
})
export class FirmasModule { }
