import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import { OficinaDetalleOut, OficinaOrecIn, OficinaOrecOut} from "../models/oficina.model";
import { Observable } from 'rxjs';
import { OficinaUbigeo } from 'src/app/core/firmas/models/firmas.model';

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

  getOficinaDetalleUbigeo(): Observable<OficinaUbigeo> {
    return this.http.get<OficinaUbigeo>(`${this.url}/orec/detalleUbigeo`);
  }

}
