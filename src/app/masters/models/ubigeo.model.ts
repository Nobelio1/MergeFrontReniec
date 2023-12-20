import {Result} from "./result.model";

export class UbigeoOut extends Result {
  data: Ubigeo[];
  constructor() {
    super();
    this.data = new Array<Ubigeo>;
  }
}

export class Ubigeo {
  codigo: string;
  descripcion: string;
  constructor() {
    this.codigo = '';
    this.descripcion = '';
  }
}
