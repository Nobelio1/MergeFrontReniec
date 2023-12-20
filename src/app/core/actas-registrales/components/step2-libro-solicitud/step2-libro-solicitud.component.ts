import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Articulo, ArticuloOut, Lengua, LenguaOut, TipoArchivo, TipoArchivoOut} from "../../../../masters/models/maestro.model";
import {Archivo, DetalleSolicitud, RegistroFirmaIn, RegistroFirmaOut} from "../../../firmas/models/firmas.model";
import {OficinaDetalle, OficinaDetalleOut} from "../../../../masters/models/oficina.model";
import {List, UploadFileComponent} from "../../../../shared/components/upload-file/upload-file.component";
import {MatStepper} from "@angular/material/stepper";
import {RequestPaso1} from "../../../firmas/components/step1-datos-solicitante/step1-datos-solicitante.component";
import {UbigeoComponent} from "../../../../masters/components/ubigeo/ubigeo.component";
import {CentroProbladoComponent} from "../../../../masters/components/centro-problado/centro-problado.component";
import {ComunidadComponent} from "../../../../masters/components/comunidad/comunidad.component";
import {OficinaAuxiliarComponent} from "../../../../masters/components/oficina-auxiliar/oficina-auxiliar.component";
import {
  OficinaAutorizadaComponent
} from "../../../../masters/components/oficina-autorizada/oficina-autorizada.component";
import {UtilService} from "../../../../shared/services/util.service";
import {NgxSpinnerService} from "ngx-spinner";
import {RegistroFirmasService} from "../../../firmas/services/registro-firmas.service";
import {MaestrosService} from "../../../../masters/services/maestros.service";
import {OficinaService} from "../../../../masters/services/oficina.service";
import { environment } from 'src/environments/environment';
import {Step2LibroDetalleComponent} from "../step2-libro-detalle/step2-libro-detalle.component";
import {DetalleSolicitudLibro, RegistroLibroIn, RegistroLibroOut} from "../../models/libro.model";
import {RegistroLibroService} from "../../services/registro-libro.service";
import { SeguridadService } from 'src/app/shared/services/seguridad.service';
import { ConfirmationModalComponent } from 'src/app/core/firmas/components/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-step2-libro-solicitud',
  templateUrl: './step2-libro-solicitud.component.html',
  styleUrls: ['./step2-libro-solicitud.component.scss']
})
export class Step2LibroSolicitudComponent implements OnInit {

  environment: any;
  form!: FormGroup;
  formDetalle!: FormGroup;

  arrayDetalle: number[] = [];

  lenguaOut!: LenguaOut;
  lengua!: Lengua[];

  articuloOut!: ArticuloOut;
  articulo!: Articulo[];

  tipoArchivoOut!: TipoArchivoOut;
  tipoArchivoSustento!: TipoArchivo[];

  detalleSolicitud!: DetalleSolicitud;

  registroLibroIn!: RegistroLibroIn;
  registroLibroOut!: RegistroLibroOut;

  oficinaDetalleOut!: OficinaDetalleOut;
  oficinaDetalle!: OficinaDetalle;

  typesAllowed = ['pdf'];

  arrayFilesSustento!: List[];
  bolProccessing: boolean = false;

  @Input() step!: MatStepper;
  @Input() requestPaso1!: RequestPaso1;

  @Output() doEmmitRequestPaso2: EventEmitter<string> = new EventEmitter();

  @ViewChild('cboUbigeo') cboUbigeo!: UbigeoComponent;
  @ViewChild('cboCentroPoblado') cboCentroPoblado!: CentroProbladoComponent;
  @ViewChild('cboComunidad') cboComunidad!: ComunidadComponent;
  @ViewChild('cboOficinaAuxiliar') cboOficinaAuxiliar!: OficinaAuxiliarComponent;
  @ViewChild('cboOficinaAutorizada') cboOficinaAutorizada!: OficinaAutorizadaComponent;

  @ViewChild('fileSustento') uploadFileTipoSolicitud!: UploadFileComponent;

  @ViewChildren(Step2LibroDetalleComponent) components!: QueryList<Step2LibroDetalleComponent>;

  constructor(private formBuilder: FormBuilder,
              public utilService: UtilService,
              private spinner: NgxSpinnerService,
              private registroLibroService: RegistroLibroService,
              private maestroService: MaestrosService,
              private oficinaService: OficinaService,
              private seguridadService: SeguridadService,
              private dialog: MatDialog,
              ) { }

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
      ubigeo: [''],
    });

    this.formDetalle.disable();

    this.listarTipoArchivo(this.environment.TIPO_ARCHIVO_LIBRO_SUSTENTO);
    this.listarLenguas();
    this.listarArticulos();
    this.listarOficinaDetalle();
  }

  listarOficinaDetalle(): void {
    this.oficinaService.listOficinaDetalle().subscribe((data: OficinaDetalleOut) => {
      this.oficinaDetalleOut = data;
    }, error => {
    }, () => {
      if (this.oficinaDetalleOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.oficinaDetalleOut.message}`);
        return;
      }
      this.oficinaDetalle = this.oficinaDetalleOut.data;
      this.formDetalle.patchValue(this.oficinaDetalle);
      this.formDetalle.controls['ubigeo'].setValue(`${this.oficinaDetalle.nombreDepartamento} / ${this.oficinaDetalle.nombreProvincia} / ${this.oficinaDetalle.nombreDistrito} ${this.oficinaDetalle?.descripcionCentroPoblado.trim() ? '/ (CENTRO POBLADO)' : ''} ${this.oficinaDetalle.descripcionCentroPoblado}`);
    })
  }

  abrirModalConfirmacion() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // El usuario hizo clic en "Sí", continuar con la acción
        // ... aquí puedes poner el código para la acción siguiente
        this.btnNext(this.step);
      } else {
        // El usuario hizo clic en "No", cancelar la acción
      }
    });
  }

  btnNext(stepper: MatStepper) {

    this.bolProccessing = true;

    // GET ARRAY FROM CHILDREN COMPONENT
    let component: Step2LibroDetalleComponent[] = this.components.toArray();
    // GET ARRAY MAPPER DETALLE SOLICITUD
    let arrayDetalle: DetalleSolicitudLibro[] = component.map(value => value.setDetalleSolicitud());

    // VALIDACION 1
    if (arrayDetalle.length <= 0) {
      this.utilService.getAlert('Aviso', 'Debe añadir por lo menos un (1) detalle de material registral.');
      this.bolProccessing = false;
      return;
    }

    // VALIDACIÓN 2 - DETALLE FORM VALID
    let cumpleValidaciones = true;
    component.forEach(x => {
      if (x.form.invalid) {
        x.setValidatorRequired();
        this.utilService.getAlert('Aviso', `El detalle del material registral (${x.index}), no cumple con los datos requeridos.`);
        cumpleValidaciones = false;
        this.bolProccessing = false;
        return;
      }
    });
    if (!cumpleValidaciones) {
      this.bolProccessing = false;
      return;
    }

    // VALIDACIÓN 3 - SUSTENTO
    this.uploadFileTipoSolicitud.setActivateValidation();
    const isFormValid = this.form.valid && this.uploadFileTipoSolicitud.form.valid;
    if (!isFormValid) {
      this.utilService.getAlert('Aviso', 'Debe completar los datos requeridos como obligatorios (*)');
      this.bolProccessing = false;
      return;
    }

    // MAPPER ARCHIVO SUSTENTO
    const archivoSustento = new Archivo;
    archivoSustento.codigoNombre = this.arrayFilesSustento[0].idFile;

    // MAPPER REGISTRO
    this.registroLibroIn = new RegistroLibroIn();
    this.registroLibroIn.archivoSustento = archivoSustento;
    this.registroLibroIn.codigoTipoArchivoSustento = this.arrayFilesSustento[0].fileTypeId;
    this.registroLibroIn.email = this.requestPaso1.email;
    this.registroLibroIn.celular = this.requestPaso1.celular;
    if(this.isExternal){
      this.registroLibroIn.codigoModoRegistro = 'E';
    } else {
      this.registroLibroIn.codigoModoRegistro = 'I';
    }    

    this.registroLibroIn.detalleSolicitud = arrayDetalle;
    this.spinner.show();
    this.registroLibroService.registroLibro(this.registroLibroIn).subscribe((data: RegistroLibroOut) => {
      this.spinner.hide();
      this.registroLibroOut = data;
    }, error => {
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
      if (this.registroLibroOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.registroLibroOut.message}`);
        this.bolProccessing = false;
        return;
      }
      this.doEmmitRequestPaso2.emit(this.registroLibroOut.data);
      // @ts-ignore
      stepper.selected.completed = true;
      stepper.next();
    });
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
    this.arrayFilesSustento = arr;
  }

  listarLenguas(): void {
    this.maestroService.listLenguas().subscribe((data: LenguaOut) => {
      this.lenguaOut = data;
    }, error => {
    }, () => {
      if (this.lenguaOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.lenguaOut.message}`);
        return;
      }
      this.lengua = this.lenguaOut.data;
      this.lengua.sort((a, b) => (a.codigo > b.codigo) ? 1 : -1);
    });
  }

  listarArticulos(): void {
    this.maestroService.listArticulos().subscribe((data: ArticuloOut) => {
      this.articuloOut = data;
    }, error => {
    }, () => {
      if (this.articuloOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.articuloOut.message}`);
        return;
      }
      this.articulo = this.articuloOut.data;
    });
  }

  listarTipoArchivo(idTipoUso: string): void {
    this.maestroService.listTipoArchivos(idTipoUso).subscribe((data: TipoArchivoOut) => {
      this.tipoArchivoOut = data;
    }, error => {
    }, () => {
      if (this.tipoArchivoOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.tipoArchivoOut.message}`);
        return;
      }
      this.tipoArchivoSustento = this.tipoArchivoOut.data;
    });
  }

  get isExternal(): boolean {
    return !this.seguridadService.getUserInternal();
  }

}
