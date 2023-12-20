import {Result} from "../../../masters/models/result.model";

export class TipoSolicitudOut extends Result {
  data: TipoSolicitud[];
  constructor() {
    super();
    this.data = new Array<TipoSolicitud>;
  }
}

export class TipoSolicitud {
  codigo: number;
  descripcion: string;
  constructor() {
    this.codigo = 0;
    this.descripcion = '';
  }
}
