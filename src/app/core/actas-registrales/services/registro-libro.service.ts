import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {
  RegistroLibroIn,
  RegistroLibroOut,
  ValidarDatosIn,
  ValidarDatosOut
} from "../../actas-registrales/models/libro.model";

@Injectable({
  providedIn: 'root'
})
export class RegistroLibroService {

  private urlService = environment.API_MASTER;
  url = `${this.urlService}/registro-libros`;

  constructor(private http: HttpClient) { }

  validarDatos(request: ValidarDatosIn) {
    return this.http.post<ValidarDatosOut>(`${this.url}/validar-datos`, request);
  }

  registroLibro(request: RegistroLibroIn) {
    return this.http.post<RegistroLibroOut>(`${this.url}`, request);
  }
}
