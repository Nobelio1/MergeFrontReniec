import { Result } from '../../../masters/models/result.model';

export class Busqueda {
  size: number;
  page: number;
  constructor() {
    this.size = 0;
    this.page = 0;
  }
}

export class BusquedaIn extends Busqueda {
  codigoAnalistaAsignado: string;
  codigoCentroPoblado: string;
  codigoDepartamento: string;
  codigoDistrito: string;
  codigoEstado: string;
  codigoOrec: string;
  codigoProvincia: string;
  codigoTipoRegistro: string;
  fechaFin: string;
  fechaIni: string;
  numeroSolicitud: string;
  constructor() {
    super();
    this.codigoAnalistaAsignado = '';
    this.codigoCentroPoblado = '';
    this.codigoDepartamento = '';
    this.codigoDistrito = '';
    this.codigoEstado = '';
    this.codigoOrec = '';
    this.codigoProvincia = '';
    this.codigoTipoRegistro = '';
    this.fechaFin = '';
    this.fechaIni = '';
    this.numeroSolicitud = '';
  }
}

export class BusquedaOut extends Result {
  data: BusquedaData[];
  page: number;
  size: number;
  totalItems: number;
  totalPage: number;
  totalElements: number;
  constructor() {
    super();
    this.data = new Array<BusquedaData>();
    this.page = 0;
    this.size = 0;
    this.totalItems = 0;
    this.totalPage = 0;
    this.totalElements = 0;
  }
}

export class BusquedaData {
  analistaAsignado: string;
  estadoSolicitud: string;
  fechaAtencion?: string;
  fechaAsignacion: string;
  fechaRecepcion: string;
  fechaSolicitud: string;
  numeroSolicitud: string;
  oficinaAutorizada: string;
  tipoRegistro: string;
  dniSolicitante: string;
  codigoAnalistaAsignado: string;
  constructor() {
    this.analistaAsignado = '';
    this.estadoSolicitud = '';
    this.fechaAsignacion = '';
    this.fechaRecepcion = '';
    this.fechaSolicitud = '';
    this.numeroSolicitud = '';
    this.oficinaAutorizada = '';
    this.tipoRegistro = '';
    this.dniSolicitante = '';
    this.codigoAnalistaAsignado = '';
  }
}
