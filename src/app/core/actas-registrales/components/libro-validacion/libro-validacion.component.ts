import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DatosOficina,
  DatosPersona,
  ValidarDatosIn,
  ValidarDatosOut,
  ConsultarRuipinIn,
  ConsultarRuipinOut,
} from '../../../firmas/models/firmas.model';
import { ValidacionDatosComponent } from '../../../../masters/components/validacion-datos/validacion-datos.component';
import { DatosOficinaAutorizadaComponent } from '../../../../masters/components/datos-oficina-autorizada/datos-oficina-autorizada.component';
import { UtilService } from '../../../../shared/services/util.service';
import { SeguridadService } from '../../../../shared/services/seguridad.service';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { RegistroLibroService } from '../../services/registro-libro.service';
import { SessionService } from '../../services/sesion.service';
import { Persona, ConsultarPorDniOut } from '../../models/libro.model';

@Component({
  selector: 'app-libro-validacion',
  templateUrl: './libro-validacion.component.html',
  styleUrls: ['./libro-validacion.component.scss'],
})
export class LibroValidacionComponent implements OnInit {
  environment: any;
  verificacionRealizada: boolean = false;
  clickCount: number = 0;

  datosPersona!: DatosPersona;
  datosOficina!: DatosOficina;

  validarDatosIn!: ValidarDatosIn;
  validarDatosOut!: ValidarDatosOut;

  //Nuevas implementaciones - libroValidacion
  consultarPorDniOut!: ConsultarPorDniOut;

  consultarRuipinIn!: ConsultarRuipinIn;
  consultarRuipinOut!: ConsultarRuipinOut;

  @ViewChild('formValidacionDatos')
  formValidacionDatos!: ValidacionDatosComponent;
  @ViewChild('formDatosOficinaAutorizada')
  formDatosOficinaAutorizada!: DatosOficinaAutorizadaComponent;

  constructor(
    public utilService: UtilService,
    private registroLibroService: RegistroLibroService,
    private seguridadService: SeguridadService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.environment = environment;
  }

  //crear el token y luego evalua
  verificar() {
    this.start();
    setTimeout(() => {
      this.consultarPorReg();
    }, 1000);
  }

  start(): void {
    // ACCESS TO DATA OF COMPONENTS CHILDS
    const formDatosPersona = this.formValidacionDatos.form.getRawValue();
    const formDatosOficina = this.formDatosOficinaAutorizada.form.getRawValue();

    if (this.formValidacionDatos.form.invalid) {
      this.formValidacionDatos.form.markAllAsTouched();
      this.utilService.getAlert(
        'Aviso',
        'Debe completar la validación de datos.'
      );
      return;
    }

    if (this.formDatosOficinaAutorizada.form.invalid) {
      this.formDatosOficinaAutorizada.form.markAllAsTouched();
      this.utilService.getAlert(
        'Aviso',
        'Debe completar los datos de la oficina autorizada.'
      );
      return;
    }

    // MAPPER OF PERSONS DATA
    this.datosPersona = new DatosPersona();
    this.datosPersona.dni = formDatosPersona.nroDni;
    this.datosPersona.digitoVerifica = formDatosPersona.digito;
    this.datosPersona.fechaEmision = formDatosPersona.fechaEmision
      ? formatDate(formDatosPersona.fechaEmision, 'yyyy-MM-dd', 'EN')
      : '';

    // MAPPER OF OFFICE DATA
    this.datosOficina = new DatosOficina();
    this.datosOficina.codigoOrec = formDatosOficina.oficinaAutorizada;

    //MAPPER RUIPIN
    this.consultarRuipinIn = new DatosPersona();
    this.consultarRuipinIn.dni = formDatosPersona.nroDni;

    // MAPPER OF REQUEST OF VALIDATE DATA
    this.validarDatosIn = new ValidarDatosIn();
    this.validarDatosIn.datosPersona = this.datosPersona;
    this.validarDatosIn.datosOficina = this.datosOficina;

    // CALL SERVICE
    this.consultarPorReg();
    this.registroLibroService.validarDatos(this.validarDatosIn).subscribe(
      (data: ValidarDatosOut) => {
        this.validarDatosOut = data;
        this.registroLibroService.setValidarDatosOutData(
          this.validarDatosOut.data
        );
      },

      (error) => {
        console.error('Error en validarDatos:', error);
      },
      () => {
        if (this.validarDatosOut.code !== this.environment.CODE_000) {
          this.utilService.getAlert(
            `Aviso:`,
            `${this.validarDatosOut.message}`
          );
          return;
        }
        this.seguridadService.setToken(
          this.environment.VAR_TOKEN_EXTERNAL,
          this.validarDatosOut.data
        );

        this.sessionService.setToken(this.validarDatosOut.data);
        this.verificacionRealizada = true;
      }
    );
  }

  consultarPorReg() {
    //VALIDAR REGISTRADOR
    const dni = this.datosPersona.dni;
    this.registroLibroService
      .consultarRegCivil(dni)
      .subscribe((data: ConsultarPorDniOut) => {
        if (data.code == this.environment.CODE_999) {
          this.utilService.getAlert(
            `Aviso:`,
            `¡Firma
          inhabilitada!,\nComunicarse con el 315-4000 anexo 1876`
          );
          return;
        }
        let persona = new Persona();
        persona = data.data;
        if (persona.estadoRegistrador == '1') {
          this.utilService.getAlert(
            `Aviso:`,
            `Oficina Autorizada ${persona.descripcionOrec}`
          );
          this.utilService.link(environment.URL_MOD_ACTAS_REGISTRALES_REGISTRO);
        }
      });
  }

  back(): void {
    this.utilService.link(environment.URL_MENU);
  }
}
