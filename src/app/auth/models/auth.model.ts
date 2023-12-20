export class AuthIn {
  username: string;
  password: string;
  constructor() {
    this.username = '';
    this.password = '';
  }
}

export class AuthOut {
  code: string;
  data: string;
  message: string;
  constructor() {
    this.code = '';
    this.data = '';
    this.message = '';
  }
}
