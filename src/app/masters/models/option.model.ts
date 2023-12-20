import {Result} from "./result.model";

export class OptionsOut extends Result {
  data: Options[];
  constructor() {
    super();
    this.data = new Array<Options>;
  }
}

export class Options {
  codigo: string;
  descripcion: string;
  constructor() {
    this.codigo = '';
    this.descripcion = '';
  }
}
