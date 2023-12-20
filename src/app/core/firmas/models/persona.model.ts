import {Result} from "../../../masters/models/result.model";

export class PersonaOut extends Result {
  data: Persona;
  data2: string;
  constructor() {
    super();
    this.data = new Persona();
    this.data2 = '';
  }
}

export class PersonaOut2 extends Result {
  data: string;
  constructor() {
    super();
    this.data = '';
  }
}
export class Persona2 {
  dni: string;

  primerApellido: string;


  constructor() {
    this.dni = '';

    this.primerApellido = '';

  }
}
export class Persona {
  dni: string;
  preNombre: string;
  primerApellido: string;
  segundoApellido: string;

  constructor() {
    this.dni = '';
    this.preNombre = '';
    this.primerApellido = '';
    this.segundoApellido = '';
  }
}
