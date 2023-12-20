import {Result} from "../../../masters/models/result.model";

export class ValidarDatosIn {
  digitoVerifica: string;
  dni: string;
  fechaEmision: string;
  numeroSolicitud: string;
  constructor() {
    this.digitoVerifica = '';
    this.dni = '';
    this.fechaEmision = '';
    this.numeroSolicitud = '';
  }
}

export class ArchivoSustento {
  codigo: string;
  nombreOriginal: string;
  tipoArchivo: string;
  constructor() {
    this.codigo = '';
    this.nombreOriginal = '';
    this.tipoArchivo = '';
  }
}
export class Detalle {
  archivoSustento: ArchivoSustento;
  codigoOrec: string;
  descripcionOrecLarga: string;
  ubigeo: string;
  constructor() {
    this.archivoSustento = new ArchivoSustento();
    this.codigoOrec = '';
    this.descripcionOrecLarga = '';
    this.ubigeo = '';
  }
}

export class DetalleLibro extends Detalle {
  detalleSolicitudLibro: DetalleSolicitudLibro[];
  constructor() {
    super();
    this.detalleSolicitudLibro = new Array<DetalleSolicitudLibro>();
  }
}

export class DetalleSolicitudLibro {
  articulo: string;
  cantidad: number;
  lengua: string;
  numeroUltimaActa: number;
  constructor() {
    this.articulo = '';
    this.cantidad = 0;
    this.lengua = '';
    this.numeroUltimaActa = 0;
  }
}

export class ObtenerDetalleFirmaOut extends Result {
  data: DetalleFirma;
  constructor() {
    super();
    this.data = new DetalleFirma();
  }
}

export class DetalleFirma extends Detalle {
  detalleSolicitudLibro: DetalleSolicitudFirma[];
  constructor() {
    super();
    this.detalleSolicitudLibro = new Array<DetalleSolicitudFirma>();
  }
}

export class DetalleSolicitudFirma {
  celular: string;
  email: string;
  idTipoSolicitud: string;
  tipoSolicitud: string;
  numeroDocumento: string;
  preNombres: string;
  primerApellido: string;
  segundoApellido: string;
  archivos: Archivos[];
  constructor() {
    this.celular = '';
    this.email = '';
    this.idTipoSolicitud = '';
    this.tipoSolicitud = '';
    this.numeroDocumento = '';
    this.preNombres = '';
    this.primerApellido = '';
    this.segundoApellido = '';
    this.archivos = new Array<Archivos>();
  }
}


export class Archivos {
  codigo: string;
  nombreOriginal: string;
  tipoArchivo: string;
  constructor() {
    this.codigo = '';
    this.nombreOriginal = '';
    this.tipoArchivo = '';
  }
}

export class ValidarDatosOut extends Result {
  data: string;
  constructor() {
    super();
    this.data = '';
  }
}

export class ObtenerDetalleLibroOut extends Result {
  data: DetalleLibro;
  constructor() {
    super();
    this.data = new DetalleLibro();
  }
}
