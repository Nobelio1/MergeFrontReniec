import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {RegistroFirmaIn, RegistroFirmaOut, ValidarDatosIn, ValidarDatosOut} from "../models/firmas.model";
import {TipoSolicitudOut} from "../models/tipo-solicitud.model";
import {PersonaOut,Persona,Persona2} from "../models/persona.model";

@Injectable({
  providedIn: 'root'
})
export class RegistroFirmasService {

  private urlService = environment.API_MASTER;
  url = `${this.urlService}/registro-firmas`;
  url2= `${this.urlService}/registrar-baja`;
  constructor(private http: HttpClient) { }

  validarDatos(request: ValidarDatosIn) {
    return this.http.post<ValidarDatosOut>(`${this.url}/validar-datos`, request);
  }

  listTipoSolicitud() {
    return this.http.get<TipoSolicitudOut>(`${this.url}/tipo-solicitud`);
  }

  registroFirma(request: RegistroFirmaIn) {
    return this.http.post<RegistroFirmaOut>(`${this.url}`, request);
  }

  registroFirma2(request: RegistroFirmaIn) {
    return this.http.post<RegistroFirmaOut>(`${this.url2}`, request);
  }

  consultarPersona(dni: string) {
    return this.http.get<PersonaOut>(`${this.url}/consultar-personas?dni=${dni}`);
  }
  consultarPersona2(request: Persona2) {
    return this.http.post<PersonaOut>(`${this.url}/consultar-por-datos-ruipin?`, request);
  }
  /*consultarPersona2(dni: string,pat: string) {
    return this.http.get<PersonaOut>(`${this.url}/consultar-por-datos-ruipin?dni=${dni}&apellidopat=${pat}`);
  }*/
}
