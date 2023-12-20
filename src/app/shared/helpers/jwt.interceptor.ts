import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SeguridadService} from "../services/seguridad.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private seguridadService: SeguridadService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let token;
    token = this.seguridadService.getToken();
    // if skip = true, not clone with token
    if (!request.headers.get('skip')) {
      if (token && token !== '') {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } else {
      request = request.clone({
        setHeaders: {
          Authorization: ''
        }
      });
    }
    return next.handle(request);
  }
}
