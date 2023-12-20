import { Component } from '@angular/core';
import {SeguridadService} from "./shared/services/seguridad.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'plataforma-electronica';

  constructor(private seguridadService: SeguridadService) {
    // TOKENS
    const tokenExists = this.seguridadService.getToken() !== '';
    if (tokenExists) {
      // ACTUALIZA EL TOKEN CUANDO SE ACTUALIZA EL BROWSER
      this.seguridadService.refreshSessionToken();
    } else {
      this.seguridadService.logout();
    }
  }
}
