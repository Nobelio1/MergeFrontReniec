import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-firma-dashboard',
  templateUrl: './firma-dashboard.component.html',
  styleUrls: ['./firma-dashboard.component.scss']
})
export class FirmaDashboardComponent implements OnInit {

  environment: any;
  title!: string;

  constructor() { }

  ngOnInit(): void {
    this.environment = environment;
    this.title = 'Registro de Firmas';
  }

}
