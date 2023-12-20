export class ChangePassIn {
  usuario: string;
  claveAnterior: string;
  claveNueva: string;
  confirmaClaveNueva: string;
  constructor() {
    this.usuario = '';
    this.claveAnterior = '';
    this.claveNueva = '';
    this.confirmaClaveNueva = '';
  }
}

export class ChangePassOut {
  code: string;
  data: string;
  message: string;
  constructor() {
    this.code = '';
    this.data = '';
    this.message = '';
  }
}
