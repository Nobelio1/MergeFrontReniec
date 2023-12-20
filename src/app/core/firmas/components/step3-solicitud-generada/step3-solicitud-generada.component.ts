import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {UtilService} from "../../../../shared/services/util.service";
import {NgxSpinnerService} from "ngx-spinner";
import { environment } from 'src/environments/environment';
import {RequestPaso1} from "../step1-datos-solicitante/step1-datos-solicitante.component";

@Component({
  selector: 'app-step3-solicitud-generada',
  templateUrl: './step3-solicitud-generada.component.html',
  styleUrls: ['./step3-solicitud-generada.component.scss']
})
export class Step3SolicitudGeneradaComponent implements OnInit {

  environment: any;
  form!: FormGroup;

  @Input() step!: MatStepper;
  @Input() requestPaso2!: string;

  constructor(private formBuilder: FormBuilder,
              public utilService: UtilService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
    });
  }

}
