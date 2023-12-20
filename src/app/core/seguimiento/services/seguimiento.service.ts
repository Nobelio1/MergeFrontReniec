import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ValidarDatosIn, ValidarDatosOut} from "../models/seguimiento.model";
import {BusquedaIn, BusquedaOut, DocumentosRespuestaOut} from "../models/busqueda.model";

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {

  private urlService = environment.API_MASTER;
  url = `${this.urlService}/seguimientos`;

  constructor(private http: HttpClient) { }

  validarDatos(request: ValidarDatosIn) {
    return this.http.post<ValidarDatosOut>(`${this.url}/validar-datos`, request);
  }

  listSolicitudes(request: BusquedaIn) {
    return this.http.post<BusquedaOut>(`${this.url}/solicitudes?page=${request.page}&size=${request.size}`, request);
  }

  getDocumentosRespuesta(nroSolicitud: string) {
    return this.http.get<DocumentosRespuestaOut>(`${this.url}/solicitudes/firma/${nroSolicitud}`);
  }

}
