import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BusquedaIn, BusquedaOut } from '../models/busqueda.model';
import {
  AsignarIn,
  AsignarOut,
  ObtenerDetalleFirmaOut,
  ObtenerDetalleLibroOut,
  ReasignarIn,
  ReasignarOut,
  RecepcionarIn,
  RecepcionarOut,
} from '../models/gestion.model';
import {
  ObtenerAtencionOut,
  RegistroAtencionIn,
  RegistroAtencionOut,
} from '../models/atencion.model';
import { ReporteOut, ReportesIn } from '../models/busquedaReporte.model';
import { BusquedaDetalleOut } from '../../reportes-detalle/models/rdReporte.model';

@Injectable({
  providedIn: 'root',
})
export class GestionService {
  private urlService = environment.API_MASTER;
  url = `${this.urlService}/gestion`;

  constructor(private http: HttpClient) {}

  listSolicitudes(request: BusquedaIn | ReportesIn) {
    return this.http.post<BusquedaOut>(
      `${this.url}/solicitudes/consultar?page=${request.page}&size=${request.size}`,
      request
    );
  }

  listSolicitudesDetalle(request: BusquedaIn | ReportesIn) {
    return this.http.post<BusquedaDetalleOut>(
      `${this.url}/solicitudes/consultarDetalle?page=${request.page}&size=${request.size}`,
      request
    );
  }

  listReportesSolicitudes(request: ReportesIn) {
    return this.http.post<ReporteOut>(
      `${this.url}/solicitudes/consultaReporte?page=${request.page}&size=${request.size}`,
      request
    );
  }

  recepcionar(request: RecepcionarIn) {
    return this.http.post<RecepcionarOut>(
      `${this.url}/solicitudes/recepcionar`,
      request
    );
  }

  // NUEVO SERVICIO PARA REASINGAR
  reasignar(request: ReasignarIn) {
    return this.http.post<ReasignarOut>(
      `${this.url}/solicitudes/reasignar`,
      request
    );
  }

  asignar(request: AsignarIn, dniCor: string = '40663120') {
    return this.http.post<AsignarOut>(
      `${this.url}/solicitudes/asignar`,
      request
    );
  }

  getDetailLibro(nroSolicitud: string) {
    return this.http.get<ObtenerDetalleLibroOut>(
      `${this.url}/solicitudes/${nroSolicitud}/libro`
    );
  }

  getDetailFirma(nroSolicitud: string) {
    return this.http.get<ObtenerDetalleFirmaOut>(
      `${this.url}/solicitudes/${nroSolicitud}/firma`
    );
  }

  getAtencionSolicitud(nroSolicitud: string) {
    return this.http.get<ObtenerAtencionOut>(
      `${this.url}/solicitudes/${nroSolicitud}/atencion`
    );
  }

  registroAtencion(request: RegistroAtencionIn) {
    return this.http.post<RegistroAtencionOut>(
      `${this.url}/solicitudes/atender`,
      request
    );
  }
}
