import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilService} from "../../../../shared/services/util.service";
import {environment} from "../../../../../environments/environment";
import {
  DatosOficinaAutorizadaComponent
} from "../../../../masters/components/datos-oficina-autorizada/datos-oficina-autorizada.component";
import {ValidacionDatosComponent} from "../../../../masters/components/validacion-datos/validacion-datos.component";
import {DatosOficina, DatosPersona, ValidarDatosIn, ValidarDatosOut} from "../../models/firmas.model";
import {RegistroFirmasService} from "../../services/registro-firmas.service";
import {formatDate} from "@angular/common";
import {SeguridadService} from "../../../../shared/services/seguridad.service";
import { User } from 'src/app/auth/models/user.model';

@Component({
  selector: 'app-firma-validacion',
  templateUrl: './firma-validacion.component.html',
  styleUrls: ['./firma-validacion.component.scss']
})
export class FirmaValidacionComponent implements OnInit {

  environment: any;

  datosPersona!: DatosPersona;
  datosOficina!: DatosOficina;

  validarDatosIn!: ValidarDatosIn;
  validarDatosOut!: ValidarDatosOut;

  @ViewChild('formValidacionDatos') formValidacionDatos!: ValidacionDatosComponent;
  @ViewChild('formDatosOficinaAutorizada') formDatosOficinaAutorizada!: DatosOficinaAutorizadaComponent;

  noSoyRobot: boolean = false;

  constructor(public utilService: UtilService,
              private registroFirmasService: RegistroFirmasService,
              private seguridadService: SeguridadService,              
              ) { }

  ngOnInit(): void {
    this.environment = environment;
  }

  start(): void {
    // ACCESS TO DATA OF COMPONENTS CHILDS
    let formDatosPersona;
    if (this.formValidacionDatos){
      formDatosPersona = this.formValidacionDatos.form.getRawValue();
      if (this.formValidacionDatos.form.invalid) {
        this.formValidacionDatos.form.markAllAsTouched();
        this.utilService.getAlert('Aviso', 'Debe completar la validación de datos.');
        return;
      }
    }

    const formDatosOficina = this.formDatosOficinaAutorizada.form.getRawValue();
    if (this.formDatosOficinaAutorizada.form.invalid) {
      this.formDatosOficinaAutorizada.form.markAllAsTouched();
      this.utilService.getAlert('Aviso', 'Debe completar los datos de la oficina autorizada.');
      return;
    }

    if( !this.noSoyRobot) {
      this.utilService.getAlert('Aviso', 'Debe seleccionar el captcha.');
      return;
    }

    // MAPPER OF PERSONS DATA
    this.datosPersona = new DatosPersona();
    if(this.isExternal){
      this.datosPersona.dni = formDatosPersona.nroDni;
      this.datosPersona.digitoVerifica = formDatosPersona.digito;
      this.datosPersona.fechaEmision = formDatosPersona.fechaEmision ? formatDate(formDatosPersona.fechaEmision, 'yyyy-MM-dd', 'EN') : '';
    } else {
      this.datosPersona.dni = this.user.dni;
    }
    
    

    // MAPPER OF OFFICE DATA
    this.datosOficina = new DatosOficina();
    this.datosOficina.codigoOrec = formDatosOficina.oficinaAutorizada;

    // MAPPER OF REQUEST OF VALIDATE DATA
    this.validarDatosIn = new ValidarDatosIn();
    this.validarDatosIn.datosPersona = this.datosPersona;
    this.validarDatosIn.datosOficina = this.datosOficina;

    // CALL SERVICE
    this.registroFirmasService.validarDatos(this.validarDatosIn).subscribe((data: ValidarDatosOut) => {
      this.validarDatosOut = data;
    }, error => {
    }, () => {
      if (this.validarDatosOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.validarDatosOut.message}`);
        return;
      }
      if(this.isExternal) {
        this.seguridadService.setToken(this.environment.VAR_TOKEN_EXTERNAL, this.validarDatosOut.data);
      }else {
        this.seguridadService.setToken(this.environment.VAR_TOKEN, this.validarDatosOut.data);
      }
      this.utilService.link(environment.URL_MOD_FIRMAS_REGISTRO);
    });
  }

  back(): void {
    this.utilService.link(environment.URL_MENU);
  }

  resolveCaptcha(resolved: boolean) {
    this.noSoyRobot = resolved;
  }

  get isExternal(): boolean {
    return !this.seguridadService.getUserInternal();
  }

  get user(): User {
    return this.seguridadService.getUser();
  }

}
