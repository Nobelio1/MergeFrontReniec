import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { environment } from 'src/environments/environment';
import {UtilService} from "../../../shared/services/util.service";
import {OficinaService} from "../../services/oficina.service";
import {OficinaOrec, OficinaOrecIn, OficinaOrecOut} from "../../models/oficina.model";

@Component({
  selector: 'app-oficina-autorizada',
  templateUrl: './oficina-autorizada.component.html',
  styleUrls: ['./oficina-autorizada.component.scss']
})
export class OficinaAutorizadaComponent implements OnInit, OnChanges {

  environment: any;
  form!: FormGroup;

  oficinaOrecIn!: OficinaOrecIn;
  oficinaOrecOut!: OficinaOrecOut;
  oficinasOrec!: OficinaOrec[];

  @Input() required: boolean = false;
  @Input() idDepartamento: string = '';
  @Input() idProvincia: string = '';
  @Input() idDistrito: string = '';
  @Input() idCentroPoblado: string = '';

  @Output() oficinaOrecSelected: EventEmitter<string> = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
              public utilService: UtilService,
              private oficinaService: OficinaService) { }

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
      idOficinaAutorizada: ['', this.required ? [Validators.required] : []],
    });

    this.validate();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form) {
      this.validate();
    }
  }

  validate(): void {
    if (this.idDepartamento || this.idProvincia || this.idDistrito || this.idCentroPoblado) {
      this.requestMapper(this.idDepartamento, this.idProvincia, this.idDistrito, this.idCentroPoblado);
    } else {
      this.form.controls['idOficinaAutorizada'].setValue('');
      this.oficinasOrec = [];
    }
  }

  requestMapper(idDepartamento: string, idProvincia: string, idDistrito: string, idCentroPoblado: string): void {
    this.oficinaOrecIn = new OficinaOrecIn();
    this.oficinaOrecIn.codigoDepartamento = idDepartamento;
    this.oficinaOrecIn.codigoProvincia = idProvincia;
    this.oficinaOrecIn.codigoDistrito = idDistrito;
    this.oficinaOrecIn.codigoCentroPoblado = idCentroPoblado;
    this.listarOficinasOrec(this.oficinaOrecIn);
  }

  listarOficinasOrec(request: OficinaOrecIn): void {
    this.oficinaService.listOficinasOrec(request).subscribe((data: OficinaOrecOut) => {
      this.oficinaOrecOut = data;
    }, error => {
    }, () => {
      if (this.oficinaOrecOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.oficinaOrecOut.message}`);
        return;
      }
      this.oficinasOrec = this.oficinaOrecOut.data;
    });
  }

  emitOficinaAutorizada(value: string) {
    this.oficinaOrecSelected.emit(value ? value : '');
  }

}
