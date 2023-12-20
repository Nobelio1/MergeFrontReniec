import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {UtilService} from "../../../../shared/services/util.service";
import {NgxSpinnerService} from "ngx-spinner";
import { environment } from 'src/environments/environment';

export interface RequestPaso1 {
  email: string;
  celular: string;
}

@Component({
  selector: 'app-step1-libro-solicitante',
  templateUrl: './step1-libro-solicitante.component.html',
  styleUrls: ['./step1-libro-solicitante.component.scss']
})
export class Step1LibroSolicitanteComponent implements OnInit {

  environment: any;
  form!: FormGroup;

  @Input() step!: MatStepper;

  @Output() doEmmitRequestPaso1: EventEmitter<RequestPaso1> = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
              public utilService: UtilService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
      email: ['', [Validators.minLength(6), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9._-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,4}$')]],
      emailConfirm: ['', [Validators.minLength(6), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9._-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,4}$')]],
      celular: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(11), Validators.pattern('^[0-9]*$')]],
      celularConfirm: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(11), Validators.pattern('^[0-9]*$')]],
    });
  }

  btnNext(stepper: MatStepper) {
    const email = this.form.controls['email'].value;
    const emailConfirm = this.form.controls['emailConfirm'].value;
    const celular = this.form.controls['celular'].value;
    const celularConfirm = this.form.controls['celularConfirm'].value;

    if (this.form.invalid) {
      this.utilService.getAlert('Aviso', 'Debe completar los datos requeridos como obligatorios (*)');
      return;
    }
    if (email !== emailConfirm) {
      this.utilService.getAlert('Aviso', 'El correo electrónico no coincide.');
      return;
    }
    if (celular !== celularConfirm) {
      this.utilService.getAlert('Aviso', 'El número de celular no coincide.');
      return;
    }

    let request: RequestPaso1;
    request = {
      email: email,
      celular: celular
    }
    this.doEmmitRequestPaso1.emit(request);
    // @ts-ignore
    stepper.selected.completed = true;
    stepper.next();
  }

}
