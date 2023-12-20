import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import {HttpClientModule} from "@angular/common/http";
import {AppMaterialModule} from "../app-material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { HeadingComponent } from './components/heading/heading.component';
import { AlertComponent } from './components/alert/alert.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import {MaterialFileInputModule} from "ngx-material-file-input";
import {GsAnalistaComponent} from "../core/gestion-solicitudes/components/gs-analista/gs-analista.component";

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    MainComponent,
    HeadingComponent,
    AlertComponent,
    ConfirmationComponent,
    UploadFileComponent
  ],
    imports: [
        CommonModule,
        HttpClientModule,
        AppMaterialModule,
        RouterModule,
        ReactiveFormsModule,
        MaterialFileInputModule
    ],
  exports: [
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    MainComponent,
    HeadingComponent,
    AlertComponent,
    ConfirmationComponent,
    UploadFileComponent,
  ]
})
export class SharedModule { }
