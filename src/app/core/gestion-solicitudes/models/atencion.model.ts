import {Result} from "../../../masters/models/result.model";

export class ObtenerAtencionOut extends Result {
  data: ObtenerAtencion;
  constructor() {
    super();
    this.data = new ObtenerAtencion();
  }
}

export class ObtenerAtencion {
  codigoOrec: string;
  descripcionOrecLarga: string;
  ubigeo: string;
  detalleSolicitudLibro: DetalleSolicitudLibroRegistro[];
  constructor() {
    this.codigoOrec = ''
    this.descripcionOrecLarga = ''
    this.ubigeo = ''
    this.detalleSolicitudLibro = new Array<DetalleSolicitudLibroRegistro>();
  }
}

// export class DetalleSolicitudLibro {
//   cantidad: number;
//   codigoArticulo: string;
//   codigoLengua: string;
//   idDetalleSolLibro: number;
//   numeroUltimaActa: number;
//   constructor() {
//     this.cantidad = 0;
//     this.codigoArticulo = '';
//     this.codigoLengua = '';
//     this.idDetalleSolLibro = 0;
//     this.numeroUltimaActa = 0;
//   }
// }

export class RegistroAtencionIn {
  archivoRespuesta: Archivo;
  codigoTipoArchivoRespuesta: string;
  detalleSolicitud: DetalleSolicitudLibroRegistro[];
  numeroSolicitud: string;
  constructor() {
    this.archivoRespuesta = new Archivo();
    this.codigoTipoArchivoRespuesta = '';
    this.detalleSolicitud = new Array<DetalleSolicitudLibroRegistro>();
    this.numeroSolicitud = '';
  }
}

export class Archivo {
  codigoNombre: string;
  constructor() {
    this.codigoNombre = '';
  }
}

export class DetalleSolicitudLibroRegistro {
  idDetalleSolLibro: number;
  cantidad: number;
  codigoArticulo: string;
  codigoLengua: string;
  numeroUltimaActa: number;
  constructor() {
    this.idDetalleSolLibro = 0;
    this.cantidad = 0;
    this.codigoArticulo = '';
    this.codigoLengua = '';
    this.numeroUltimaActa = 0;
  }
}

export class RegistroAtencionOut extends Result {
  data: boolean;
  constructor() {
    super();
    this.data = false;
  }
}
