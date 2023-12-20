import { Component, OnInit } from '@angular/core';
import {UtilService} from "../../services/util.service";
import {environment} from "../../../../environments/environment";
import {User} from "../../../auth/models/user.model";
import {SeguridadService} from "../../services/seguridad.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  environment: any;

  user?: User;
  subUser!: Subscription;

  constructor(public utilService: UtilService,
              private seguridadService: SeguridadService) {
    this.subUser = this.seguridadService.getObsUser().subscribe((data: User) => {
      this.user = data;
    });
  }

  ngOnInit(): void {
    this.environment = environment;
  }

  logout(): void {
    this.seguridadService.logout();
    this.utilService.link(environment.URL_INTRO);
  }

  esExternal(): boolean {
   return !this.seguridadService.getUserInternal();
  }

  esInternal(): boolean {
    return this.seguridadService.getUserInternal();
  }

}
