import {Injectable} from '@angular/core';
import {UtilService} from "./util.service";
import {environment} from "../../../environments/environment";
import {JwtHelperService} from "@auth0/angular-jwt";
import {User} from "../../auth/models/user.model";
import {BehaviorSubject, interval, Observable, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {RefreshTokenOut} from "../models/seguridad.model";

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  private _obsUser: BehaviorSubject<User> = new BehaviorSubject(new User());

  subSessionRefresh: Subscription;

  private urlService = environment.API_MASTER;
  url = `${this.urlService}/seguridad`;

  constructor(public utilService: UtilService,
              private http: HttpClient,
              private jwtHelper: JwtHelperService) {
    this.refreshSessionData();
    /* REFRESCO DE TOKEN CONTROLADO "N" VECES => 180000 */
    const periodo = interval(180000);
    this.subSessionRefresh = periodo.subscribe(val => {
      if (this.getToken()) {
        this.refreshSessionToken();
        this.refreshSessionData();
      }
    });
  }

  refreshSessionData(): void {
    if (!this.getToken()) {
      return;
    }
    const token = this.getToken();
    if (token && token !== '') {
      if (this.getUserInternal()) {
        this.setToken(environment.VAR_TOKEN, token);
      }
      if (this.getUserExternal()) {
        this.setToken(environment.VAR_TOKEN_EXTERNAL, token);
      }
    }
  }

  refreshSessionToken() {
    if (!this.getToken()) {
      return;
    }
    this.http.get<RefreshTokenOut>(`${this.url}/refresh-token`).subscribe((data: RefreshTokenOut) => {
      // SAVE DATA & TOKEN
      if (this.getUserInternal()) {
        this.setToken(environment.VAR_TOKEN, data.data);
      }
      if (this.getUserExternal()) {
        this.setToken(environment.VAR_TOKEN_EXTERNAL, data.data);
      }

    }, (error) => {
      this.logout();
      return;
    });
  }

  setToken(tokenName: string, token: string) {
    this.setUser(token);
    return this.utilService.setLocalStorage(tokenName, token);
  }

  getToken() {
    const internal = this.utilService.getLocalStorage(environment.VAR_TOKEN);
    const external = this.utilService.getLocalStorage(environment.VAR_TOKEN_EXTERNAL);
    return internal ? internal : external;
  }

  getUserInternal() {
    return this.utilService.getLocalStorage(environment.VAR_TOKEN);
  }

  getUserExternal() {
    return this.utilService.getLocalStorage(environment.VAR_TOKEN_EXTERNAL);
  }

  setUser(token: string): void {
    const payloadUser = this.jwtHelper.decodeToken(token);
    let user: User;
    user = payloadUser.personaInfo;
    this._obsUser.next(user);
    this.utilService.setLocalStorage(environment.VAR_USER, JSON.stringify(user));
  }

  getUser(): User {
    const user = this.utilService.getLocalStorage(environment.VAR_USER);
    return JSON.parse(user);
  }

  getObsUser(): Observable<User> {
    return this._obsUser.asObservable();
  }

  public isAuthenticated(): boolean {
    const tokenExists = this.utilService.getLocalStorage(environment.VAR_TOKEN_EXTERNAL);
    const userExists = this.utilService.getLocalStorage(environment.VAR_USER);
    return !!(tokenExists && userExists);
  }

  public isAuthenticatedInternal(): boolean {
    const tokenExists = this.utilService.getLocalStorage(environment.VAR_TOKEN);
    const userExists = this.utilService.getLocalStorage(environment.VAR_USER);
    return !!(tokenExists && userExists);
  }

  clearLocalStorage(): void {
    this.utilService.removeLocalStorage(environment.VAR_TOKEN_EXTERNAL);
    this.utilService.removeLocalStorage(environment.VAR_TOKEN);
    this.utilService.removeLocalStorage(environment.VAR_USER);
  }

  logout(): void {
    this._obsUser.next(new User);
    this.utilService.removeLocalStorage(environment.VAR_TOKEN_EXTERNAL);
    this.utilService.removeLocalStorage(environment.VAR_TOKEN);
    this.utilService.removeLocalStorage(environment.VAR_USER);
    this.utilService.link(environment.URL_INTRO);
  }
}
