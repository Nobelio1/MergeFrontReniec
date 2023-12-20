import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {SeguridadService} from "../services/seguridad.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GuardianUserInternalGuard implements CanActivate {

  constructor(private router: Router,
              private seguridadService: SeguridadService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.seguridadService.isAuthenticatedInternal()) {
      return true;
    } else {
      return this.router.navigate([environment.URL_LOGIN])
    }
  }

}
