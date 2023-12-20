import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { environment } from 'src/environments/environment';
import {UtilService} from "../../../../shared/services/util.service";
import {List, UploadFileComponent} from "../../../../shared/components/upload-file/upload-file.component";
import {TipoSolicitud} from "../../models/tipo-solicitud.model";
import {TipoArchivo} from "../../../../masters/models/maestro.model";
import {Archivo, ArchivoDetalle, DetalleSolicitud} from "../../models/firmas.model";
import {SeguridadService} from "../../../../shared/services/seguridad.service";
import {RegistroFirmasService} from "../../services/registro-firmas.service";
import {Persona, PersonaOut,Persona2} from "../../models/persona.model";
import { ValidacionRegCivilModalComponent } from '../validacion-reg-civil-modal/validacion-reg-civil-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-step2-detalle-solicitud',
  templateUrl: './step2-detalle-solicitud.component.html',
  styleUrls: ['./step2-detalle-solicitud.component.scss']
})
export class Step2DetalleSolicitudComponent implements OnInit {
  personaIn!: Persona;
  personaIn2!: Persona2;
  personaOut!: PersonaOut;
  environment: any;
  form!: FormGroup;

  typesAllowed = ['pdf'];

  arrayFiles!: List[];

  arrayTipoArchivo: TipoArchivo[] = [];

  detalleSolicitud!: DetalleSolicitud;

  // requiredTipoArchivoBoolean: boolean = true;
  disabledAll: boolean = false;

  @Input() index: number | undefined;
  @Input() arrayTipoSolicitud!: TipoSolicitud[] | [];
  @Input() arrayTipoArchivoAlta!: TipoArchivo[] | [];
  @Input() arrayTipoArchivoActualizar!: TipoArchivo[] | [];

  @ViewChild('filesTipoSolicitud') uploadFileTipoSolicitud!: UploadFileComponent;
  @ViewChild('dniApellidoModal') dniApellidoModal!: TemplateRef<any>;


  constructor(private formBuilder: FormBuilder,
              public utilService: UtilService,
              private registroFirmasService: RegistroFirmasService,
             private dialog: MatDialog,
           private seguridadService: SeguridadService) { }


  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
      index: [this.index],
      idTipoSolicitud: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8),
      Validators.maxLength(8), Validators.pattern('^[0-9]*$')]],
      celular: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9._-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,4}$')]],
      preNombres: ['', [Validators.required, Validators.maxLength(60)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(40)]],
      segundoApellido: ['', [Validators.required, Validators.maxLength(40)]],
    });
  }

  setValidatorRequired() {
    this.form.markAllAsTouched();
  }

  showResponse(message: string) {
    this.utilService.getAlert('Aviso', message);
  }

  getFilesArray(arr: List[]): void {
    this.arrayFiles = arr;

    // BLOQUEAR TIPO DE SOLICITUD SI AGREGA 1 ARCHIVO O MÁS
    if (this.arrayFiles.length > 0) {
      this.form.controls['idTipoSolicitud'].disable();
    } else {
      this.form.controls['idTipoSolicitud'].enable();
    }
  }

  fnLoadTipoArchivo(idTipoSolicitud: number): void {
    switch (idTipoSolicitud) {
      case this.environment.TIPO_SOLICITUD_ALTA:
        this.arrayTipoArchivo = this.arrayTipoArchivoAlta;
        this.disabledAll = false;
        this.form.get('celular')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]);
      this.form.get('email')?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9._-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,4}$')]);
        break;
      case this.environment.TIPO_SOLICITUD_BAJA:
        this.arrayTipoArchivo = [];
        // this.requiredTipoArchivoBoolean = false;

        this.disabledAll = true;
        this.form.get('celular')?.clearValidators();
        this.form.get('email')?.clearValidators();
        break;
      case this.environment.TIPO_SOLICITUD_ACTUALIZAR:
        this.arrayTipoArchivo = this.arrayTipoArchivoActualizar;
        this.disabledAll = false;
        this.form.get('celular')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]);
        this.form.get('email')?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9._-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,4}$')]);

        break;
    }
    this.form.get('celular')?.updateValueAndValidity();
    this.form.get('email')?.updateValueAndValidity();
  }

  setDetalleSolicitud(): DetalleSolicitud {
    this.detalleSolicitud = new DetalleSolicitud();
    this.detalleSolicitud.idTipoSolicitud = this.form.controls['idTipoSolicitud'].value;
    this.detalleSolicitud.numeroDocumento = this.form.controls['numeroDocumento'].value;
    this.detalleSolicitud.celular = this.form.controls['celular'].value;
    this.detalleSolicitud.email = this.form.controls['email'].value;
    this.detalleSolicitud.preNombres = this.form.controls['preNombres'].value;
    this.detalleSolicitud.primerApellido = this.form.controls['primerApellido'].value;
    this.detalleSolicitud.segundoApellido = this.form.controls['segundoApellido'].value;

    const detalleArchivo = new Array<ArchivoDetalle>();
    if (this.arrayFiles && this.arrayFiles.length > 0) {
      this.arrayFiles.forEach(x => {
        const archivoModel = new Archivo();
        archivoModel.codigoNombre = x.idFile
        detalleArchivo.push(
          {
            codigoTipoArchivo: x.fileTypeId,
            archivo: archivoModel
          }
        );
      });
    }

    this.detalleSolicitud.detalleArchivo = detalleArchivo;

    // EMMIT
    return this.detalleSolicitud;
  }

  getPersona(): void {
    const dni = this.form.controls['numeroDocumento'].value;
    if (dni) {
      this.registroFirmasService.consultarPersona(dni).subscribe((data: PersonaOut) => {
        if (data.code !== this.environment.CODE_000) {
          this.utilService.getAlert('Aviso', data.message);
          return;
        }
        let persona = new Persona();
        persona = data.data;
        this.form.controls['preNombres'].setValue(persona.preNombre);
        this.form.controls['primerApellido'].setValue(persona.primerApellido);
        this.form.controls['segundoApellido'].setValue(persona.segundoApellido);
      });
    }
  }
  openDialogAfterDNITyped(): void {
    const dialogRef = this.dialog.open(ValidacionRegCivilModalComponent);

    dialogRef.afterClosed().subscribe(apellido => {
      if (apellido) {
        this.validateDNIandApellido(apellido);
      }
    });
  }
  validateDNIandApellido(apellidoPaternoIngresado: string): void {
  const dni = this.form.controls['numeroDocumento'].value;

  if (dni && apellidoPaternoIngresado) {
    this.registroFirmasService.consultarPersona(dni).subscribe((data: PersonaOut) => {
      if (data.code !== this.environment.CODE_000) {
        this.utilService.getAlert('Aviso', data.message);
        return;
      }

      let persona = data.data;

      // Convertir ambos apellidos a mayúsculas antes de comparar
      if (persona.primerApellido.toUpperCase() === apellidoPaternoIngresado.toUpperCase()) {
        this.form.controls['preNombres'].setValue(persona.preNombre);
        this.form.controls['segundoApellido'].setValue(persona.segundoApellido);
        this.form.controls['primerApellido'].setValue(persona.primerApellido);
      } else {
        this.utilService.getAlert('Aviso', 'El apellido paterno introducido no coincide con el registrado para ese DNI.');
      }
    });
  }
}

validateDNI(): void {

  const dni = this.form.controls['numeroDocumento'].value;
  const apellidoPaternoIngresado = this.form.controls['primerApellido'].value;


  if (dni && apellidoPaternoIngresado) {
        this.personaIn2 = new Persona2();
      this.personaIn2.dni = this.form.controls['numeroDocumento'].value;
      this.personaIn2.primerApellido = apellidoPaternoIngresado;

    this.registroFirmasService.consultarPersona2(this.personaIn2).subscribe((data: PersonaOut) => {
      this.personaOut = data;

    }, error => {

    }, () => {

      if (this.personaOut.code !== this.environment.CODE_000) {

        this.utilService.getAlert(`Aviso:`, `${this.personaOut.message}`);
        return;
      }

      this.seguridadService.setToken(this.environment.VAR_TOKEN_EXTERNAL, this.personaOut.data2);

      let persona = this.personaIn;

      // Convertir ambos apellidos a mayúsculas antes de comparar
      if (persona.primerApellido.toUpperCase() === apellidoPaternoIngresado.toUpperCase()) {
        this.form.controls['preNombres'].setValue(persona.preNombre);
        this.form.controls['segundoApellido'].setValue(persona.segundoApellido);
        this.form.controls['primerApellido'].setValue(persona.primerApellido);
          this.dialog.closeAll();

      } else {
        this.utilService.getAlert('Aviso', 'El apellido paterno introducido no coincide con el registrado para ese DNI.');
        this.form.controls['preNombres'].setValue("");
        this.form.controls['segundoApellido'].setValue("");
        this.form.controls['primerApellido'].setValue("");
      }

    });


/*    this.registroFirmasService.consultarPersona(dni).subscribe((data: PersonaOut) => {
  //this.registroFirmasService.consultarPersona2(dni,apellidoPaternoIngresado).subscribe((data: PersonaOut) => {
      if (data.code !== this.environment.CODE_000) {
        this.utilService.getAlert('Aviso', data.message);
        return;
      }

      let persona = data.data;

      // Convertir ambos apellidos a mayúsculas antes de comparar
      if (persona.primerApellido.toUpperCase() === apellidoPaternoIngresado.toUpperCase()) {
        this.form.controls['preNombres'].setValue(persona.preNombre);
        this.form.controls['segundoApellido'].setValue(persona.segundoApellido);
        this.form.controls['primerApellido'].setValue(persona.primerApellido);
          this.dialog.closeAll();
      } else {
        this.utilService.getAlert('Aviso', 'El apellido paterno introducido no coincide con el registrado para ese DNI.');
        this.form.controls['preNombres'].setValue("");
        this.form.controls['segundoApellido'].setValue("");
        this.form.controls['primerApellido'].setValue("");*
      }
    });*/

  }
}

openDNIValidationModal(): void {
  const dialogRef = this.dialog.open(this.dniApellidoModal);

/*  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.validateDNIandApellido(result);
//this.validateDNI();
    }
  });*/
}

onNoClick(): void {
  this.dialog.closeAll();
}


}
