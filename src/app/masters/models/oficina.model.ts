import { Result } from './result.model';

export class OficinaOrecIn {
  codigoCentroPoblado: string;
  codigoDepartamento: string;
  codigoDistrito: string;
  codigoProvincia: string;
  constructor() {
    this.codigoCentroPoblado = '';
    this.codigoDepartamento = '';
    this.codigoDistrito = '';
    this.codigoProvincia = '';
  }
}

export class OficinaOrecOut extends Result {
  data: OficinaOrec[];
  constructor() {
    super();
    this.data = new Array<OficinaOrec>();
  }
}

export class OficinaOrec {
  codigo: string;
  descripcion: string;
  constructor() {
    this.codigo = '';
    this.descripcion = '';
  }
}

export class OficinaDetalleOut extends Result {
  data: OficinaDetalle;
  constructor() {
    super();
    this.data = new OficinaDetalle();
  }
}

export class OficinaDetalle {
  codigoOrec!: string;
  descripcionCentroPoblado: string;
  descripcionLocalLarga: string;
  nombreDepartamento: string;
  nombreDistrito: string;
  nombreProvincia: string;
  constructor() {
    this.codigoOrec = '';
    this.descripcionCentroPoblado = '';
    this.descripcionLocalLarga = '';
    this.nombreDepartamento = '';
    this.nombreDistrito = '';
    this.nombreProvincia = '';
  }
}
