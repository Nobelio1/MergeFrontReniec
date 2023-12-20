import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AuthIn, AuthOut} from "../models/auth.model";
import {ChangePassIn, ChangePassOut} from "../models/change-password.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlService = environment.API_MASTER;
  url = `${this.urlService}/seguridad`;

  constructor(private http: HttpClient) { }

  login(authIn: AuthIn) {
    const url = `${this.url}/identificar`;
    return this.http.post<AuthOut>(url, authIn);
  }

  changePass(request: ChangePassIn) {
    const url = `${this.url}/cambio-clave`;
    return this.http.post<ChangePassOut>(url, request);
  }

}
