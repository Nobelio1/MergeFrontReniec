import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {APP_BASE_HREF} from "@angular/common";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {RouterModule} from "@angular/router";
import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "./shared/shared.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {JwtInterceptor} from "./shared/helpers/jwt.interceptor";
import {environment} from "../environments/environment";
import {HTTP_INTERCEPTORS} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
    NgxSpinnerModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: (request) => {
          if (request?.url.includes(environment.URL_MOD_FIRMAS)) {
            return localStorage.getItem(environment.VAR_TOKEN_EXTERNAL);
          }
          return localStorage.getItem(environment.VAR_TOKEN);
        },
        allowedDomains: environment.jwtDomainsTokenized
      }
    }),
  ],
  exports: [NgxSpinnerModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/plataforma-electronica' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    JwtHelperService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
