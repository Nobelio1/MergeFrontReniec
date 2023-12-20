import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { environment } from 'src/environments/environment';
import {Ubigeo, UbigeoOut} from "../../models/ubigeo.model";
import {UtilService} from "../../../shared/services/util.service";
import {UbigeoService} from "../../services/ubigeo.service";

@Component({
  selector: 'app-ubigeo',
  templateUrl: './ubigeo.component.html',
  styleUrls: ['./ubigeo.component.scss']
})
export class UbigeoComponent implements OnInit, OnChanges {

  environment: any;
  form!: FormGroup;

  label!: string;

  ubigeoOut!: UbigeoOut;
  ubigeo!: Ubigeo[];

  @Input() required: boolean = false;
  @Input() type: string = '';
  @Input() idDepartamento: string = '';
  @Input() idProvincia: string = '';

  @Output() ubigeoSelected: EventEmitter<string> = new EventEmitter();
  @Input() reset: boolean = false;
  constructor(private formBuilder: FormBuilder,
              public utilService: UtilService,
              private ubigeoService: UbigeoService) { }

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
      sUbigeo: ['', this.required ? [Validators.required] : []],
    });

    this.fnValidate();

  }

  ngOnChanges(changes: SimpleChanges) {
    this.fnValidate();
    if (this.reset) {
      this.form.controls['sUbigeo'].setValue('');
    }
  }

  fnValidate(): void {
    if (this.form) {
      this.callUbigeo(this.type);
    }
  }

  callUbigeo(type: string): void {
    switch (type) {
      case 'DEP':
        this.label = 'Departamento';
        this.listarDep();
        // if (this.selectEmpty) {
        //   this.form.controls['sUbigeo'].setValue('');
        // }
        break;
      case 'PRO':
        this.label = 'Provincia';

        this.form.controls['sUbigeo'].setValue('');
        this.ubigeo = [];

        if (this.idDepartamento) {
          this.listarPro(this.idDepartamento);
          this.form.controls['sUbigeo'].setValue('');
        }
        break;
      case 'DIS':
        this.label = 'Distrito';

        this.form.controls['sUbigeo'].setValue('');
        this.ubigeo = [];

        if (this.idDepartamento) {
          this.form.controls['sUbigeo'].setValue('');
          this.ubigeo = [];
        }
        if (this.idDepartamento && this.idProvincia) {
          this.listarDis(this.idDepartamento, this.idProvincia);
          this.form.controls['sUbigeo'].setValue('');
        }
        break;
    }
  }

  listarDep(): void {
    this.ubigeoService.listDep().subscribe((data: UbigeoOut) => {
      this.ubigeoOut = data;
    }, error => {
    }, () => {
      if (this.ubigeoOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.ubigeoOut.message}`);
        return;
      }
      this.ubigeo = this.ubigeoOut.data;
    });
  }

  listarPro(idDepartamento: string): void {
    this.ubigeoService.listPro(idDepartamento).subscribe((data: UbigeoOut) => {
      this.ubigeoOut = data;
    }, error => {
    }, () => {
      if (this.ubigeoOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.ubigeoOut.message}`);
        return;
      }
      this.ubigeo = this.ubigeoOut.data;
    });
  }

  listarDis(idDepartamento: string, idProvincia: string): void {
    this.ubigeoService.listDis(idDepartamento, idProvincia).subscribe((data: UbigeoOut) => {
      this.ubigeoOut = data;
    }, error => {
    }, () => {
      if (this.ubigeoOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.ubigeoOut.message}`);
        return;
      }
      this.ubigeo = this.ubigeoOut.data;
    });
  }

  setActivateValidation() {
    if (this.form.valid) {
      return;
    }

    if (this.required) {
      this.setValidatorRequired();
    }
  }

  setValidatorRequired() {
    if (this.form.controls['sUbigeo'].invalid) {
      this.form.controls['sUbigeo'].setValidators([Validators.required]);
      this.form.controls['sUbigeo'].setErrors({ required: true });
    }
    this.form.markAllAsTouched();
  }

  emitUbigeo(value: string) {
    this.ubigeoSelected.emit(value ? value : '');
  }

}
