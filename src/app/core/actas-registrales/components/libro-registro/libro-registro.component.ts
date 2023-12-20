import { Component, OnInit } from '@angular/core';
import {RequestPaso1} from "../../../firmas/components/step1-datos-solicitante/step1-datos-solicitante.component";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-libro-registro',
  templateUrl: './libro-registro.component.html',
  styleUrls: ['./libro-registro.component.scss']
})
export class LibroRegistroComponent implements OnInit {

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
