import {Result} from "../../../masters/models/result.model";
import {Busqueda} from "../../gestion-solicitudes/models/busqueda.model";

export class BusquedaIn extends Busqueda {
  fechaFin: string;
  fechaIni: string;
  numeroSolicitud: string;
  constructor() {
    super();
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
  codigoArchivoRespuesta: string;
  codigoArchivoSustento: string;
  estadoSolicitud: string;
  fechaSolicitud: string;
  numeroSolicitud: string;
  tipoRegistro: string;
  constructor() {
    this.codigoArchivoRespuesta = '';
    this.codigoArchivoSustento = '';
    this.estadoSolicitud = '';
    this.fechaSolicitud = '';
    this.numeroSolicitud = '';
    this.tipoRegistro = '';
  }
}

export class DocumentosRespuestaOut extends Result {
  data: DocumentosRespuesta[];
  constructor() {
    super();
    this.data = new Array<DocumentosRespuesta>();
  }
}

export class DocumentosRespuesta {
  archivoRespuesta: ArchivosRespuesta;
  numeroDocumento: string;
  preNombres: string;
  primerApellido: string;
  segundoApellido: string;
  tipoSolicitud: string;
  constructor() {
    this.archivoRespuesta = new ArchivosRespuesta();
    this.numeroDocumento = '';
    this.preNombres = '';
    this.primerApellido = '';
    this.segundoApellido = '';
    this.tipoSolicitud = '';
  }
}

export class ArchivosRespuesta {
  codigo: string;
  nombreOriginal: string;
  tipoArchivo: string;
  constructor() {
    this.codigo = '';
    this.nombreOriginal = '';
    this.tipoArchivo = '';
  }
}
