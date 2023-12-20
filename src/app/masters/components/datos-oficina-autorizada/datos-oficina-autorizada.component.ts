import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import { environment } from 'src/environments/environment';
import {UtilService} from "../../../shared/services/util.service";
import {UbigeoComponent} from "../ubigeo/ubigeo.component";
import {CentroProbladoComponent} from "../centro-problado/centro-problado.component";
import {ComunidadComponent} from "../comunidad/comunidad.component";
import {OficinaAuxiliarComponent} from "../oficina-auxiliar/oficina-auxiliar.component";
import {OficinaAutorizadaComponent} from "../oficina-autorizada/oficina-autorizada.component";
import {AgenciaComponent} from "../agencia/agencia.component";
import { SeguridadService } from 'src/app/shared/services/seguridad.service';
import { OficinaService } from '../../services/oficina.service';
import { OficinaUbigeo } from 'src/app/core/firmas/models/firmas.model';

@Component({
  selector: 'app-datos-oficina-autorizada',
  templateUrl: './datos-oficina-autorizada.component.html',
  styleUrls: ['./datos-oficina-autorizada.component.scss']
})
export class DatosOficinaAutorizadaComponent implements OnInit {

  environment: any;

  form!: FormGroup;

  @ViewChild('cboUbigeo') cboUbigeo!: UbigeoComponent;
  @ViewChild('cboCentroPoblado') cboCentroPoblado!: CentroProbladoComponent;
  @ViewChild('cboComunidad') cboComunidad!: ComunidadComponent;
  @ViewChild('cboOficinaAuxiliar') cboOficinaAuxiliar!: OficinaAuxiliarComponent;
  @ViewChild('cboOficinaAutorizada') cboOficinaAutorizada!: OficinaAutorizadaComponent;
  @ViewChild('cboAgencia') cboAgencia!: AgenciaComponent;

  constructor(private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              public utilService: UtilService,
              private seguridadService: SeguridadService,
              private oficinaService: OficinaService,
              ) { }

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
      ubigeoDepartamento: [''],
      ubigeoProvincia: [''],
      ubigeoDistrito: [''],
      centroPoblado: [''],
      oficinaAutorizada: ['', [Validators.required]],
    });

    // if(this.isInternal && this.isAuthenticatedInternal) {
    //   this.cargarOficinaAutorizada();
    // }

  }

  cargarOficinaAutorizada() {
    this.oficinaService.getOficinaDetalleUbigeo().subscribe(
      {
        next: (data: OficinaUbigeo) => {
          console.log('dataaa = ', data);
          if(data) {
            this.form.controls['ubigeoDepartamento'].setValue(data.codigoDepartamento);
            this.form.controls['ubigeoProvincia'].setValue(data.codigoProvincia);
            this.form.controls['ubigeoDistrito'].setValue(data.codigoDistrito);
            this.form.controls['centroPoblado'].setValue(data.codigoCentroPoblado);
            this.form.controls['oficinaAutorizada'].setValue(data.codigoOrec);
          }
        }
      }
    );
  }

  getDep(ubigeo: string) {
    this.form.controls['ubigeoDepartamento'].setValue(ubigeo);

    this.form.controls['ubigeoProvincia'].setValue('');
    this.form.controls['ubigeoDistrito'].setValue('');
    this.form.controls['oficinaAutorizada'].setValue('');
  }

  getPro(ubigeo: string) {
    this.form.controls['ubigeoProvincia'].setValue(ubigeo);

    this.form.controls['ubigeoDistrito'].setValue('');
    this.form.controls['oficinaAutorizada'].setValue('');
  }

  getDis(ubigeo: string) {
    this.form.controls['ubigeoDistrito'].setValue(ubigeo);

    this.form.controls['oficinaAutorizada'].setValue('');
  }

  getCentroPoblado(ubigeo: string) {
    this.form.controls['centroPoblado'].setValue(ubigeo);
  }

  getOficinaAutorizada(idOficinaOrec: string) {
    this.form.controls['oficinaAutorizada'].setValue(idOficinaOrec);
  }

  get isInternal(): boolean {
    return this.seguridadService.getUserInternal();
  }

  get isAuthenticatedInternal(): boolean {
    return this.seguridadService.isAuthenticatedInternal();
  }

}
