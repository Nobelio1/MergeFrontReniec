export class RefreshTokenOut {
  code: string;
  data: string;
  message: string;
  constructor() {
    this.code = '';
    this.data = '';
    this.message = '';
  }
}
