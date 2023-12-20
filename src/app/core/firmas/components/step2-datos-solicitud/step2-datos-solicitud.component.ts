import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { UtilService } from '../../../../shared/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { UbigeoComponent } from '../../../../masters/components/ubigeo/ubigeo.component';
import { CentroProbladoComponent } from '../../../../masters/components/centro-problado/centro-problado.component';
import { ComunidadComponent } from '../../../../masters/components/comunidad/comunidad.component';
import { OficinaAuxiliarComponent } from '../../../../masters/components/oficina-auxiliar/oficina-auxiliar.component';
import { OficinaAutorizadaComponent } from '../../../../masters/components/oficina-autorizada/oficina-autorizada.component';
import { Step2DetalleSolicitudComponent } from '../step2-detalle-solicitud/step2-detalle-solicitud.component';
import {
  TipoSolicitud,
  TipoSolicitudOut,
} from '../../models/tipo-solicitud.model';
import { RegistroFirmasService } from '../../services/registro-firmas.service';
import {
  TipoArchivo,
  TipoArchivoOut,
} from '../../../../masters/models/maestro.model';
import { MaestrosService } from '../../../../masters/services/maestros.service';
import {
  List,
  UploadFileComponent,
} from '../../../../shared/components/upload-file/upload-file.component';
import {
  Archivo,
  DetalleSolicitud,
  RegistroFirmaIn,
  RegistroFirmaOut,
  Sustento,
} from '../../models/firmas.model';
import { RequestPaso1 } from '../step1-datos-solicitante/step1-datos-solicitante.component';
import { OficinaService } from '../../../../masters/services/oficina.service';
import {
  OficinaDetalle,
  OficinaDetalleOut,
} from '../../../../masters/models/oficina.model';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

export interface Detalle {
  index: number;
  idTipoSolicitud: number;
  numeroDocumento: string;
  preNombres: string;
  primerApellido: string;
  segundoApellido: string;
  celular: string;
  email: string;
}

@Component({
  selector: 'app-step2-datos-solicitud',
  templateUrl: './step2-datos-solicitud.component.html',
  styleUrls: ['./step2-datos-solicitud.component.scss'],
})
export class Step2DatosSolicitudComponent implements OnInit {
  environment: any;
  form!: FormGroup;
  formDetalle!: FormGroup;

  arrayDetalle: number[] = [];

  tipoSolicitudOut!: TipoSolicitudOut;
  tipoSolicitud!: TipoSolicitud[];

  listaArchivoSustento!: Archivo[];

  tipoArchivoOut!: TipoArchivoOut;
  tipoArchivoDetalleAlta!: TipoArchivo[];
  tipoArchivoDetalleActualizar!: TipoArchivo[];
  tipoArchivoSustento!: TipoArchivo[];

  detalleSolicitud!: DetalleSolicitud;

  registroFirmaIn!: RegistroFirmaIn;
  registroFirmaOut!: RegistroFirmaOut;

  oficinaDetalleOut!: OficinaDetalleOut;
  oficinaDetalle!: OficinaDetalle;

  typesAllowed = ['pdf'];

  arrayFilesSustento!: List[];

  @Input() step!: MatStepper;
  @Input() requestPaso1!: RequestPaso1;

  @Output() doEmmitRequestPaso2: EventEmitter<string> = new EventEmitter();

  @ViewChild('cboUbigeo') cboUbigeo!: UbigeoComponent;
  @ViewChild('cboCentroPoblado') cboCentroPoblado!: CentroProbladoComponent;
  @ViewChild('cboComunidad') cboComunidad!: ComunidadComponent;
  @ViewChild('cboOficinaAuxiliar')
  cboOficinaAuxiliar!: OficinaAuxiliarComponent;
  @ViewChild('cboOficinaAutorizada')
  cboOficinaAutorizada!: OficinaAutorizadaComponent;

  @ViewChild('fileSustento') uploadFileTipoSolicitud!: UploadFileComponent;

  @ViewChildren(Step2DetalleSolicitudComponent)
  components!: QueryList<Step2DetalleSolicitudComponent>;

  constructor(
    private formBuilder: FormBuilder,
    public utilService: UtilService,
    private spinner: NgxSpinnerService,
    private registroFirmasService: RegistroFirmasService,
    private maestroService: MaestrosService,
    private oficinaService: OficinaService,
    public dialog: MatDialog
  ) {}

  abrirModalConfirmacion() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // El usuario hizo clic en "Sí", continuar con la acción
        // ... aquí puedes poner el código para la acción siguiente
        this.btnNext(this.step);
      } else {
        // El usuario hizo clic en "No", cancelar la acción
      }
    });
  }

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
      ubigeoDepartamento: [''],
      ubigeoProvincia: [''],
      ubigeoDistrito: [''],
      centroPoblado: [''],
      oficinaAutorizada: [''],
    });

    this.formDetalle = this.formBuilder.group({
      codigoOrec: [''],
      descripcionCentroPoblado: [''],
      descripcionLocalLarga: [''],
      nombreDepartamento: [''],
      nombreDistrito: [''],
      nombreProvincia: [''],
    });

    this.formDetalle.disable();

    this.listarTipoSolicitud();
    this.listarTipoArchivo(this.environment.TIPO_ARCHIVO_FIRMA_SUSTENTO);
    this.listarTipoArchivo(this.environment.TIPO_ARCHIVO_FIRMA_DETALLE_ALTA);
    this.listarTipoArchivo(
      this.environment.TIPO_ARCHIVO_FIRMA_DETALLE_ACTUALIZAR
    );
    this.listarOficinaDetalle();
  }

  listarOficinaDetalle(): void {
    this.oficinaService.listOficinaDetalle().subscribe(
      (data: OficinaDetalleOut) => {
        this.oficinaDetalleOut = data;
      },
      (error) => {},
      () => {
        if (this.oficinaDetalleOut.code !== this.environment.CODE_000) {
          this.utilService.getAlert(
            `Aviso:`,
            `${this.oficinaDetalleOut.message}`
          );
          return;
        }
        this.oficinaDetalle = this.oficinaDetalleOut.data;
        this.formDetalle.patchValue(this.oficinaDetalle);
      }
    );
  }

  btnNext(stepper: MatStepper) {
    // GET ARRAY FROM CHILDREN COMPONENT
    let component: Step2DetalleSolicitudComponent[] = this.components.toArray();

    // GET ARRAY MAPPER DETALLE SOLICITUD
    let arrayDetalle: DetalleSolicitud[] = component.map((value) =>
      value.setDetalleSolicitud()
    );

    // VALIDACION 1
    if (arrayDetalle.length <= 0) {
      this.utilService.getAlert(
        'Aviso',
        'Debe añadir por lo menos un (1) detalle de solicitud de firma.'
      );
      return;
    }

    // VALIDACIÓN 2 - DETALLE FORM VALID
    let cumpleValidaciones = true;
    component.forEach((x) => {
      if (x.form.invalid) {
        x.setValidatorRequired();
        this.utilService.getAlert(
          'Aviso',
          `El detalle de solicitud de firma (${x.index}), no cumple con los datos requeridos.`
        );
        cumpleValidaciones = false;
        return;
      }
    });
    if (!cumpleValidaciones) {
      return;
    }

    // VALIDACIÓN 3 - ARCHIVOS POR TIPO DE SOLICITUD
    let cumpleValidacionesArchivos = true;
    component.forEach((x) => {
      if (
        x.detalleSolicitud.idTipoSolicitud ===
        this.environment.TIPO_SOLICITUD_ALTA
      ) {
        const arrAltaRequired = ['03', '04'];
        const result = arrAltaRequired.filter(
          (value) =>
            !x.detalleSolicitud.detalleArchivo.some(
              (obj) => obj.codigoTipoArchivo === value
            )
        );
        if (result.length > 0) {
          const missing = this.tipoArchivoDetalleAlta.filter((obj) =>
            result.some((value) => value === obj.codigo)
          );
          const list = missing
            .map((item) => `<li>${item.descripcion}</li>`)
            .join('');
          this.utilService.getAlert(
            'Tipo solicitud: ALTA',
            `En el detalle de solicitud de firma (${x.index}), debe añadir los siguientes documentos obligatorios: <ul class="mt-3">${list}</ul>`,
            'left'
          );
          cumpleValidacionesArchivos = false;
          return;
        }
      }
      if (
        x.detalleSolicitud.idTipoSolicitud ===
        this.environment.TIPO_SOLICITUD_ACTUALIZAR
      ) {
        const arrActualizarRequired = ['09', '10'];
        const result = arrActualizarRequired.filter(
          (value) =>
            !x.detalleSolicitud.detalleArchivo.some(
              (obj) => obj.codigoTipoArchivo === value
            )
        );
        if (result.length > 0) {
          const missing = this.tipoArchivoDetalleActualizar.filter((obj) =>
            result.some((value) => value === obj.codigo)
          );
          const list = missing
            .map((item) => `<li>${item.descripcion}</li>`)
            .join('');
          this.utilService.getAlert(
            'Tipo solicitud: ACTUALIZAR',
            `En el detalle de solicitud de firma (${x.index}), debe añadir los siguientes documentos obligatorios: <ul class="mt-3">${list}</ul>`,
            'left'
          );
          cumpleValidacionesArchivos = false;
          return;
        }
      }
    });
    if (!cumpleValidacionesArchivos) {
      return;
    }

    // VALIDACIÓN 4 - SUSTENTO
    this.uploadFileTipoSolicitud.setActivateValidation();
    const isFormValid =
      this.form.valid && this.uploadFileTipoSolicitud.form.valid;
    if (!isFormValid) {
      this.utilService.getAlert(
        'Aviso',
        'Debe completar los datos requeridos como obligatorios (*)'
      );
      return;
    }

    // MAPPER ARCHIVO SUSTENTO

    // MAPPER REGISTRO
    this.registroFirmaIn = new RegistroFirmaIn();
    const archivoSustento = new Array<Sustento>();
    this.arrayFilesSustento.forEach((x) => {
      archivoSustento.push({
        codigoNombre: x.idFile,
        tipoCodigoNombre: x.fileTypeId,
      });
    });

    this.registroFirmaIn.listArchivoSustento = archivoSustento;
    this.registroFirmaIn.email = this.requestPaso1.email;
    this.registroFirmaIn.celular = this.requestPaso1.celular;
    this.registroFirmaIn.codigoModoRegistro = 'E';
    this.registroFirmaIn.detalleSolicitud = arrayDetalle;

    this.registroFirmasService.registroFirma(this.registroFirmaIn).subscribe(
      (data: RegistroFirmaOut) => {
        this.registroFirmaOut = data;
      },
      (error) => {},
      () => {
        if (this.registroFirmaOut.code !== this.environment.CODE_000) {
          this.utilService.getAlert(
            `Aviso:`,
            `${this.registroFirmaOut.message}`
          );
          return;
        }
        this.doEmmitRequestPaso2.emit(this.registroFirmaOut.data);
        // @ts-ignore
        stepper.selected.completed = true;
        stepper.next();
      }
    );
  }

  btnAddDetalle(): void {
    this.arrayDetalle.push(this.arrayDetalle.length + 1);
  }

  btnDeleteDetalle(item: number): void {
    this.arrayDetalle.splice(this.arrayDetalle.indexOf(item, 0), 1);
  }

  showResponse(message: string) {
    this.utilService.getAlert('Aviso', message);
  }

  getFilesArray(arr: List[]): void {
    //RECIBIENDO ARCHIVO
    this.arrayFilesSustento = arr;
  }

  listarTipoSolicitud(): void {
    this.registroFirmasService.listTipoSolicitud().subscribe(
      (data: TipoSolicitudOut) => {
        this.tipoSolicitudOut = data;
      },
      (error) => {},
      () => {
        if (this.tipoSolicitudOut.code !== this.environment.CODE_000) {
          this.utilService.getAlert(
            `Aviso:`,
            `${this.tipoSolicitudOut.message}`
          );
          return;
        }
        this.tipoSolicitud = this.tipoSolicitudOut.data;
      }
    );
  }

  listarTipoArchivo(idTipoUso: string): void {
    this.maestroService.listTipoArchivos(idTipoUso).subscribe(
      (data: TipoArchivoOut) => {
        this.tipoArchivoOut = data;
      },
      (error) => {},
      () => {
        if (this.tipoArchivoOut.code !== this.environment.CODE_000) {
          this.utilService.getAlert(`Aviso:`, `${this.tipoArchivoOut.message}`);
          return;
        }

        // SE LLAMA AL SERVICIO PARA OBTENER LA LISTA DE TIPO DE ARCHIVO PARA LOS 3 CASOS
        switch (idTipoUso) {
          case this.environment.TIPO_ARCHIVO_FIRMA_SUSTENTO:
            this.tipoArchivoSustento = this.tipoArchivoOut.data;
            break;
          case this.environment.TIPO_ARCHIVO_FIRMA_DETALLE_ALTA:
            this.tipoArchivoDetalleAlta = this.tipoArchivoOut.data;
            break;
          case this.environment.TIPO_ARCHIVO_FIRMA_DETALLE_ACTUALIZAR:
            this.tipoArchivoDetalleActualizar = this.tipoArchivoOut.data;
            break;
        }
      }
    );
  }
}
