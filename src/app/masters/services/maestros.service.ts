import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  ArticuloOut,
  LenguaOut,
  TipoArchivoOut,
} from '../models/maestro.model';
import { OptionsOut } from '../models/option.model';

@Injectable({
  providedIn: 'root',
})
export class MaestrosService {
  private urlService = environment.API_MASTER;
  url = `${this.urlService}/maestros`;

  constructor(private http: HttpClient) {}

  /*
  TIPO DE ARCHIVO
  01 TIPO DE ARCHIVO PARA SUSTENTO DE FIRMA
  02 TIPO DE ARCHIVO PARA DETALLE DE FIRMA
  03 TIPO DE ARCHIVO PARA SUSTENTO DE LIBRO
  * */
  listTipoArchivos(idTipoUso: string) {
    return this.http.get<TipoArchivoOut>(
      `${this.url}/tipo-archivos?idTipoUso=${idTipoUso}`
    );
  }

  listLenguas() {
    return this.http.get<LenguaOut>(`${this.url}/lenguas`);
  }

  listLenguasOficina(codigo: string) {
    return this.http.get<LenguaOut>(
      `${this.url}/lenguas-por-oficina/${codigo}`
    );
  }

  listArticulos() {
    return this.http.get<ArticuloOut>(`${this.url}/articulos`);
  }

  listAnalistas() {
    return this.http.get<OptionsOut>(`${this.url}/analistas`);
  }

  listEstadoSolicitud() {
    return this.http.get<OptionsOut>(`${this.url}/sol-estados`);
  }

  listTipoRegistro() {
    return this.http.get<OptionsOut>(`${this.url}/sol-tipo-registros`);
  }
}
