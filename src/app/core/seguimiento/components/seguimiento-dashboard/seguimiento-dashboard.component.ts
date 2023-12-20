import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seguimiento-dashboard',
  templateUrl: './seguimiento-dashboard.component.html',
  styleUrls: ['./seguimiento-dashboard.component.scss']
})
export class SeguimientoDashboardComponent implements OnInit {

  environment: any;
  title!: string;

  constructor() { }

  ngOnInit(): void {
    this.environment = environment;
    this.title = 'Seguimiento de Solicitudes';
  }

}
