export class User {
  dni: string;
  primerApellido: string;
  segundoApellido: string;
  preNombre: string;
  codigoOrec: string;
  permisos: string[];
  perfil: Perfil;
  grupo: Grupo;
  constructor() {
    this.dni = '';
    this.primerApellido = '';
    this.segundoApellido = '';
    this.preNombre = '';
    this.codigoOrec = '';
    this.permisos = new Array<string>();
    this.perfil = new Perfil();
    this.grupo = new Grupo();
  }
}

export class Perfil {
  codigo: string;
  descripcion: string;
  constructor() {
    this.codigo = '';
    this.descripcion = '';
  }
}

export class Grupo {
  codigo: string;
  descripcion: string;
  constructor() {
    this.codigo = '';
    this.descripcion = '';
  }
}
