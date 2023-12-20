import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { environment } from 'src/environments/environment';
import {UtilService} from "../../../shared/services/util.service";
import {UbigeoService} from "../../services/ubigeo.service";
import {Ubigeo, UbigeoOut} from "../../models/ubigeo.model";

@Component({
  selector: 'app-centro-problado',
  templateUrl: './centro-problado.component.html',
  styleUrls: ['./centro-problado.component.scss']
})
export class CentroProbladoComponent implements OnInit, OnChanges {

  environment: any;
  form!: FormGroup;

  ubigeoOut!: UbigeoOut;
  ubigeo!: Ubigeo[];

  @Input() required: boolean = false;
  @Input() idDepartamento: string = '';
  @Input() idProvincia: string = '';
  @Input() idDistrito: string = '';

  @Output() ubigeoSelected: EventEmitter<string> = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
              public utilService: UtilService,
              private ubigeoService: UbigeoService) { }

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
      sUbigeo: ['', this.required ? [Validators.required] : []],
    });

    this.validate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form) {
      this.validate();
    }
  }

  validate(): void {
    if (this.idDepartamento && this.idProvincia && this.idDistrito) {
      this.listarCentroPoblado(this.idDepartamento, this.idProvincia, this.idDistrito);
    } else {
      this.form.controls['sUbigeo'].setValue('')
      this.ubigeo = [];
    }
  }

  listarCentroPoblado(idDepartamento: string, idProvincia: string, idDistrito: string): void {
    this.ubigeoService.listCentroPoblado(idDepartamento, idProvincia, idDistrito).subscribe((data: UbigeoOut) => {
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

  emitCentroPoblado(value: string) {
    this.ubigeoSelected.emit(value ? value : '');
  }

}
