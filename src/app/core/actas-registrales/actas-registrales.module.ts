import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActasRegistralesRoutingModule } from './actas-registrales-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {AppMaterialModule} from "../../app-material.module";
import {NgxSpinnerModule} from "ngx-spinner";
import { LibroDashboardComponent } from './components/libro-dashboard/libro-dashboard.component';
import { LibroRegistroComponent } from './components/libro-registro/libro-registro.component';
import { LibroValidacionComponent } from './components/libro-validacion/libro-validacion.component';
import { Step1LibroSolicitanteComponent } from './components/step1-libro-solicitante/step1-libro-solicitante.component';
import { Step2LibroSolicitudComponent } from './components/step2-libro-solicitud/step2-libro-solicitud.component';
import { Step2LibroDetalleComponent } from './components/step2-libro-detalle/step2-libro-detalle.component';
import { Step3LibroGeneradoComponent } from './components/step3-libro-generado/step3-libro-generado.component';
import {SharedModule} from "../../shared/shared.module";
import {MastersModule} from "../../masters/masters.module";

@NgModule({
    declarations: [

        LibroDashboardComponent,
        LibroRegistroComponent,
        LibroValidacionComponent,
        Step1LibroSolicitanteComponent,
        Step2LibroSolicitudComponent,
        Step2LibroDetalleComponent,
        Step3LibroGeneradoComponent
    ],
    exports: [
        Step2LibroDetalleComponent
    ],
    imports: [
        CommonModule,
        ActasRegistralesRoutingModule,
        ReactiveFormsModule,
        AppMaterialModule,
        NgxSpinnerModule,
        SharedModule,
        MastersModule
    ]
})
export class ActasRegistralesModule { }
