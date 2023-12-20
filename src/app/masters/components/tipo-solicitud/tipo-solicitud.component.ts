import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { environment } from 'src/environments/environment';
import {UtilService} from "../../../shared/services/util.service";
import {RegistroFirmasService} from "../../../core/firmas/services/registro-firmas.service";
import {TipoSolicitud, TipoSolicitudOut} from "../../../core/firmas/models/tipo-solicitud.model";

@Component({
  selector: 'app-tipo-solicitud',
  templateUrl: './tipo-solicitud.component.html',
  styleUrls: ['./tipo-solicitud.component.scss']
})
export class TipoSolicitudComponent implements OnInit {

  environment: any;
  form!: FormGroup;

  tipoSolicitudOut!: TipoSolicitudOut;
  tipoSolicitud!: TipoSolicitud[];

  @Input() required: boolean = false;

  @Output() tipoSolicitudSelected: EventEmitter<number> = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
              public utilService: UtilService,
              private registroFirmasService: RegistroFirmasService) { }

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
      idTipoSolicitud: ['', this.required ? [Validators.required] : []],
    });

    this.listarTipoSolicitud();
  }

  listarTipoSolicitud(): void {
    this.registroFirmasService.listTipoSolicitud().subscribe((data: TipoSolicitudOut) => {
      this.tipoSolicitudOut = data;
    }, error => {
    }, () => {
      if (this.tipoSolicitudOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.tipoSolicitudOut.message}`);
        return;
      }
      this.tipoSolicitud = this.tipoSolicitudOut.data;
    });
  }

  emitTipoSolicitud(value: number) {
    this.tipoSolicitudSelected.emit(value ? value : 0);
  }

}
