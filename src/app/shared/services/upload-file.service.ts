import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DeleteOut, GetFileOut, UploadOut} from '../models/upload-file.model';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private _urlService = environment.API_MASTER;
  url = `${this._urlService}/archivos`;

  constructor(private http: HttpClient) { }

  upload(formData: any): Observable<UploadOut>{
    return this.http.post<UploadOut>(`${this.url}/upload`, formData);
  }

  delete(idFile: string): Observable<DeleteOut>{
    return this.http.delete<DeleteOut>(`${this.url}/${idFile}`);
  }

  getFile(codigo: string) {
    return this.http.get<GetFileOut>(`${this.url}/${codigo}`);
  }
}
