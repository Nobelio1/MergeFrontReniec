import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {SeguridadService} from "../../../shared/services/seguridad.service";

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  environment: any;

  constructor(private seguridadService: SeguridadService) {
    this.seguridadService.logout();
  }

  ngOnInit(): void {
    this.environment = environment;
  }

}
