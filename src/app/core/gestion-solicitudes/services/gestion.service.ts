import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {BusquedaIn, BusquedaOut} from "../models/busqueda.model";
import {
  AsignarIn,
  AsignarOut, EliminarSolicitudIn, EliminarSolicitudOut, ObtenerDetalleFirmaOut,
  ObtenerDetalleLibroOut,
  RecepcionarIn,
  RecepcionarOut,
  UpdateSolicitudIn,
} from "../models/gestion.model";
import {ObtenerAtencionOut, RegistroAtencionIn, RegistroAtencionOut} from "../models/atencion.model";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestionService {

  private urlService = environment.API_MASTER;
  url = `${this.urlService}/gestion`;

  constructor(private http: HttpClient) { }

  listSolicitudes(request: BusquedaIn) {
    return this.http.post<BusquedaOut>(`${this.url}/solicitudes/consultar?page=${request.page}&size=${request.size}`, request);
  }

  recepcionar(request: RecepcionarIn) {
    return this.http.post<RecepcionarOut>(`${this.url}/solicitudes/recepcionar`, request);
  }

  asignar(request: AsignarIn) {
    return this.http.post<AsignarOut>(`${this.url}/solicitudes/asignar`, request);
  }

  getDetailLibro(nroSolicitud: string) {
    return this.http.get<ObtenerDetalleLibroOut>(`${this.url}/solicitudes/${nroSolicitud}/libro`);
  }

  getDetailFirma(nroSolicitud: string) {
    return this.http.get<ObtenerDetalleFirmaOut>(`${this.url}/solicitudes/${nroSolicitud}/firma`);
  }

  getAtencionSolicitud(nroSolicitud: string) {
    return this.http.get<ObtenerAtencionOut>(`${this.url}/solicitudes/${nroSolicitud}/atencion`);
  }

  registroAtencion(request: RegistroAtencionIn) {
    return this.http.post<RegistroAtencionOut>(`${this.url}/solicitudes/atender`, request);
  }

  eliminarSolicitud(request: EliminarSolicitudIn) {
    return this.http.post<EliminarSolicitudOut>(`${this.url}/solicitudes/eliminar`, request);
  }

  updateSolicitudFirma(request: UpdateSolicitudIn): Observable<any> {
    return this.http.post<any>(`${this.url}/solicitudes/actualizarSolFirma`, request);
  }

  updateSolicitudLibro(request: UpdateSolicitudIn): Observable<any> {
    return this.http.post<any>(`${this.url}/solicitudes/actualizarSolLibro`, request);
  }

}
