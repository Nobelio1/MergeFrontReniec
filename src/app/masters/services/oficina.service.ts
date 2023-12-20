import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {OficinaDetalleOut, OficinaOrecIn, OficinaOrecOut} from "../models/oficina.model";

@Injectable({
  providedIn: 'root'
})
export class OficinaService {

  private urlService = environment.API_MASTER;
  url = `${this.urlService}/oficinas`;

  constructor(private http: HttpClient) { }

  listOficinasOrec(request: OficinaOrecIn) {
    return this.http.post<OficinaOrecOut>(`${this.url}/orec`, request);
  }

  listOficinaDetalle() {
    return this.http.get<OficinaDetalleOut>(`${this.url}/orec/detalle`);
  }
}
