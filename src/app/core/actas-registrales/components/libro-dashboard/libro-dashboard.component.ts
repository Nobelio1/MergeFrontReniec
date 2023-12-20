import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-libro-dashboard',
  templateUrl: './libro-dashboard.component.html',
  styleUrls: ['./libro-dashboard.component.scss']
})
export class LibroDashboardComponent implements OnInit {

  environment: any;
  title!: string;

  constructor() { }

  ngOnInit(): void {
    this.environment = environment;
    this.title = 'Libro de Actas Registrales';
  }

}
