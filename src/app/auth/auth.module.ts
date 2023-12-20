import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import {AppMaterialModule} from "../app-material.module";
import { IntroComponent } from './components/intro/intro.component';
import { OptionsComponent } from './components/options/options.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    IntroComponent,
    OptionsComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    AppMaterialModule,
    NgxSpinnerModule
  ],
  exports: [
    ChangePasswordComponent
  ]
})
export class AuthModule { }
