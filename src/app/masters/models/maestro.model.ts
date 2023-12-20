import {Result} from "./result.model";

export class TipoArchivoOut extends Result {
  data: TipoArchivo[];
  constructor() {
    super();
    this.data = new Array<TipoArchivo>;
  }
}

export class TipoArchivo {
  codigo: string;
  descripcion: string;
  constructor() {
    this.codigo = '';
    this.descripcion = '';
  }
}

export class LenguaOut extends Result {
  data: Lengua[];
  constructor() {
    super();
    this.data = new Array<Lengua>;
  }
}

export class Lengua {
  codigo: number;
  descripcion: string;
  constructor() {
    this.codigo = 0;
    this.descripcion = '';
  }
}

export class ArticuloOut extends Result {
  data: Articulo[];
  constructor() {
    super();
    this.data = new Array<Articulo>;
  }
}

export class Articulo {
  codigo: number;
  descripcion: string;
  constructor() {
    this.codigo = 0;
    this.descripcion = '';
  }
}
