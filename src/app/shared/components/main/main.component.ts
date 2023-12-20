import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {SeguridadService} from "../../services/seguridad.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  environment: any;
  title!: string;

  constructor(private seguridadService: SeguridadService) { }

  ngOnInit(): void {
    this.environment = environment;
    this.title = 'Menú';

    this.seguridadService.clearLocalStorage();
  }

}
