import { Result } from 'src/app/masters/models/result.model';
import { ReporteData } from '../../gestion-solicitudes/models/busquedaReporte.model';
import {
  DetalleFirma,
  DetalleLibro,
} from '../../gestion-solicitudes/models/gestion.model';

export class BusquedaDetalleOut extends Result {
  data: ReporteDetalleExp[];
  page: number;
  size: number;
  totalItems: number;
  totalPage: number;
  totalElements: number;
  constructor() {
    super();
    this.data = new Array<ReporteDetalleExp>();
    this.page = 0;
    this.size = 0;
    this.totalItems = 0;
    this.totalPage = 0;
    this.totalElements = 0;
  }
}

export class ReporteDetalleExp {
  numeroSolicitud: string;
  fechaAsignacion: string;
  fechaAtencion?: string;
  fechaRecepcion: string;
  detalleRegistro: string;
  analistaAsignado: string;
  numeroDocumento: string;
  nombreDepartamento: string;
  nombreProvincia: string;
  nombreDistrito: string;
  nombreCentroPoblado: string;
  preNombres: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  celular: string;
  plazo?: string;
  constructor() {
    this.analistaAsignado = '';
    this.fechaAsignacion = '';
    this.fechaAtencion = '';
    this.fechaRecepcion = '';
    this.numeroSolicitud = '';
    this.plazo = '';
    this.numeroDocumento = '';
    this.preNombres = '';
    this.primerApellido = '';
    this.segundoApellido = '';
    this.detalleRegistro = '';
    this.email = '';
    this.celular = '';
    this.nombreDepartamento = '';
    this.nombreDistrito = '';
    this.nombreProvincia = '';
    this.nombreCentroPoblado = '';
  }
}
