import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UbigeoOut} from "../models/ubigeo.model";

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  private urlService = environment.API_MASTER;
  url = `${this.urlService}/ubigeos`;

  constructor(private http: HttpClient) { }

  listDep() {
    return this.http.get<UbigeoOut>(`${this.url}/departamentos`);
  }

  listPro(idDepartamento: string) {
    return this.http.get<UbigeoOut>(`${this.url}/provincias?idDepartamento=${idDepartamento}`);
  }

  listDis(idDepartamento: string, idProvincia: string) {
    return this.http.get<UbigeoOut>(`${this.url}/distritos?idDepartamento=${idDepartamento}&idProvincia=${idProvincia}`);
  }

  listCentroPoblado(idDepartamento: string, idProvincia: string, idDistrito: string) {
    return this.http.get<UbigeoOut>(`${this.url}/centro-poblados?idDepartamento=${idDepartamento}&idProvincia=${idProvincia}&idDistrito=${idDistrito}`);
  }

}
