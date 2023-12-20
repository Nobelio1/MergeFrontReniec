import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {RequestPaso1} from "../step1-datos-solicitante/step1-datos-solicitante.component";

@Component({
  selector: 'app-firma-registro',
  templateUrl: './firma-registro.component.html',
  styleUrls: ['./firma-registro.component.scss']
})
export class FirmaRegistroComponent implements OnInit {

  requestPaso1!: RequestPaso1;
  requestPaso2!: string;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  getRequestPaso1(request: RequestPaso1): void {
    this.requestPaso1 = request;
  }

  getRequestPaso2(request: string): void {
    this.requestPaso2 = request;
  }

}
