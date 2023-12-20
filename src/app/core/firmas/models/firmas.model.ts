import {Result} from "../../../masters/models/result.model";

export class ValidarDatosIn {
  datosOficina: DatosOficina;
  datosPersona: DatosPersona;
  constructor() {
    this.datosOficina = new DatosOficina();
    this.datosPersona = new DatosPersona();
  }
}

export class ValidarDatosOut extends Result {
  data: string;
  constructor() {
    super();
    this.data = '';
  }
}

export class DatosOficina {
  codigoOrec: string;
  constructor() {
    this.codigoOrec = '';
  }
}

export class DatosPersona {
  digitoVerifica: string;
  dni: string;
  fechaEmision: string;
  constructor() {
    this.digitoVerifica = '';
    this.dni = '';
    this.fechaEmision = '';
  }
}

export class RegistroFirmaOut extends Result {
  data: string;
  constructor() {
    super();
    this.data = '';
  }
}

export class RegistroFirmaIn {
  archivoSustento: Archivo;
  codigoTipoArchivoSustento: string;
  email: string;
  celular: string;
  codigoModoRegistro: string;
  detalleSolicitud: DetalleSolicitud[];
  constructor() {
    this.archivoSustento = new Archivo();
    this.codigoTipoArchivoSustento = '';
    this.email = '';
    this.celular = '';
    this.codigoModoRegistro = '';
    this.detalleSolicitud = new Array<DetalleSolicitud>();
  }
}

export class Archivo {
  codigoNombre: string;
  constructor() {
    this.codigoNombre = '';
  }
}

export class ArchivoDetalle {
  archivo: Archivo;
  codigoTipoArchivo: string;
  constructor() {
    this.archivo = new Archivo();
    this.codigoTipoArchivo = '';
  }
}

export class DetalleSolicitud {
  idTipoSolicitud: number;
  numeroDocumento: string;
  celular: string;
  email: string;
  preNombres: string;
  primerApellido: string;
  segundoApellido: string;
  detalleArchivo: ArchivoDetalle[];
  constructor() {
    this.idTipoSolicitud = 0;
    this.numeroDocumento = '';
    this.celular = '';
    this.email = '';
    this.preNombres = '';
    this.primerApellido = '';
    this.segundoApellido = '';
    this.detalleArchivo = new Array<ArchivoDetalle>();
  }
}

export interface OficinaUbigeo {
  codigoOrec: string;
  descripcionLocalLarga: string;
  descripcionLocalCorta: string;
  descripcionUbigeo: string;
  descripcionUbigeoDetalle: string;
  codigoDepartamento: string;
  codigoProvincia: string;
  codigoDistrito: string;
  codigoCentroPoblado: string;
  nombreDepartamento: string;
  nombreProvincia: string;
  nombreDistrito: string;
  descripcionCentroPoblado: string;
}


