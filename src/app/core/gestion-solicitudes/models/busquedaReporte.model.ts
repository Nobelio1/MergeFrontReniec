import { Result } from '../../../masters/models/result.model';

export class Busqueda {
  size: number;
  page: number;
  constructor() {
    this.size = 0;
    this.page = 0;
  }
}

export class ReportesIn extends Busqueda {
  codigoAnalistaAsignado?: string;
  codigoEstado: string;
  codigoOrec: string;
  codigoTipoRegistro: string;
  fechaFin: string;
  fechaIni: string;
  numeroSolicitud: string;
  dniSolicitante: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  constructor() {
    super();
    this.codigoAnalistaAsignado = '';
    this.codigoEstado = '';
    this.codigoOrec = '';
    this.codigoTipoRegistro = '';
    this.fechaFin = '';
    this.fechaIni = '';
    this.numeroSolicitud = '';
    this.dniSolicitante = '';
    this.apellidoMaterno = '';
    this.apellidoPaterno = '';
  }
}
export class ReporteOut extends Result {
  data: ReporteData[];
  page: number;
  size: number;
  totalItems: number;
  totalPage: number;
  totalElements: number;
  constructor() {
    super();
    this.data = new Array<ReporteData>();
    this.page = 0;
    this.size = 0;
    this.totalItems = 0;
    this.totalPage = 0;
    this.totalElements = 0;
  }
}

export class ReporteData {
  dniSolicitante?: string;
  analistaAsignado: string;
  estadoSolicitud: string;
  fechaAtencion?: string;
  fechaAsignacion: string;
  fechaRecepcion: string;
  fechaSolicitud: string;
  numeroSolicitud: string;
  oficinaAutorizada: string;
  codigoOrec?: string;
  tipoRegistro: string;
  plazo?: string;
  constructor() {
    this.analistaAsignado = '';
    this.estadoSolicitud = '';
    this.fechaAsignacion = '';
    this.fechaRecepcion = '';
    this.fechaSolicitud = '';
    this.numeroSolicitud = '';
    this.oficinaAutorizada = '';
    this.codigoOrec = '';
    this.tipoRegistro = '';
    this.dniSolicitante = '';
    this.plazo = '';
  }
}
