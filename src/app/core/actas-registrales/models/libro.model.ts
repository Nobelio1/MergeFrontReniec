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

export class RegistroLibroOut extends Result {
  data: string;
  constructor() {
    super();
    this.data = '';
  }
}

export class RegistroLibroIn {
  archivoSustento: Archivo;
  codigoTipoArchivoSustento: string;
  email: string;
  celular: string;
  codigoModoRegistro: string;
  detalleSolicitud: DetalleSolicitudLibro[];
  constructor() {
    this.archivoSustento = new Archivo();
    this.codigoTipoArchivoSustento = '';
    this.email = '';
    this.celular = '';
    this.codigoModoRegistro = '';
    this.detalleSolicitud = new Array<DetalleSolicitudLibro>();
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

export class DetalleSolicitudLibro {
  cantidad: number;
  codigoArticulo: string;
  codigoLengua: string;
  numeroUltimaActa: number;
  constructor() {
    this.cantidad = 0;
    this.codigoArticulo = '';
    this.codigoLengua = '';
    this.numeroUltimaActa = 0;
  }
}
