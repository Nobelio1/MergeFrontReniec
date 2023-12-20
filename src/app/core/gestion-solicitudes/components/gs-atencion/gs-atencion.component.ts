import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  DetalleSolicitudLibroRegistro,
  ObtenerAtencion,
  ObtenerAtencionOut,
  RegistroAtencionIn,
  RegistroAtencionOut
} from "../../models/atencion.model";
import {UtilService} from "../../../../shared/services/util.service";
import {GestionService} from "../../services/gestion.service";
import {MaestrosService} from "../../../../masters/services/maestros.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {List, UploadFileComponent} from "../../../../shared/components/upload-file/upload-file.component";
import {
  Articulo,
  ArticuloOut,
  Lengua,
  LenguaOut,
  TipoArchivo,
  TipoArchivoOut
} from "../../../../masters/models/maestro.model";
import {
  Step2LibroDetalleComponent
} from "../../../actas-registrales/components/step2-libro-detalle/step2-libro-detalle.component";
import {Archivo} from "../../../firmas/models/firmas.model";

@Component({
  selector: 'app-gs-atencion',
  templateUrl: './gs-atencion.component.html',
  styleUrls: ['./gs-atencion.component.scss']
})
export class GsAtencionComponent implements OnInit {

  environment: any;
  title!: string;

  formDetalle!: FormGroup;

  numeroSolicitud!: string;

  arrayDetalle: DetalleSolicitudLibroRegistro[] = [];

  lenguaOut!: LenguaOut;
  lengua!: Lengua[];

  articuloOut!: ArticuloOut;
  articulo!: Articulo[];

  // ATENCION SOLICITUDES
  obtenerAtencionOut!: ObtenerAtencionOut;
  obtenerAtencion!: ObtenerAtencion;

  typesAllowed = ['pdf'];

  arrayFilesSustento!: List[];

  tipoArchivoOut!: TipoArchivoOut;
  tipoArchivoSustento!: TipoArchivo[];

  registroAtencionIn!: RegistroAtencionIn;
  registroAtencionOut!: RegistroAtencionOut;

  @ViewChild('fileSustento') uploadFileTipoSolicitud!: UploadFileComponent;

  @ViewChildren(Step2LibroDetalleComponent) components!: QueryList<Step2LibroDetalleComponent>;

  constructor(public utilService: UtilService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private gestionService: GestionService,
              private maestrosService: MaestrosService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.environment = environment;
    this.title = 'Atención de Solicitudes de Libro';

    this.activatedRoute.params.subscribe((params) => {

      if (params['id']) {
        this.numeroSolicitud = params['id'];
        this.getAtender(this.numeroSolicitud);
      }

    });

    this.formDetalle = this.formBuilder.group({
      codigoOrec: [''],
      descripcionOrecLarga: [''],
      ubigeo: [''],
    });

    this.formDetalle.disable();

    this.listarTipoArchivo(this.environment.TIPO_ARCHIVO_LIBRO_SUSTENTO);
    this.listarLenguas();
    this.listarArticulos();
  }

  getAtender(numeroSolicitud: string): void {
    this.spinner.show();
    this.gestionService.getAtencionSolicitud(numeroSolicitud).subscribe((data: ObtenerAtencionOut) => {
      this.spinner.hide();
      this.obtenerAtencionOut = data;
    }, error => {
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
      if (this.obtenerAtencionOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.obtenerAtencionOut.message}`);
        return;
      }
      this.obtenerAtencion = this.obtenerAtencionOut.data;
      this.formDetalle.patchValue(this.obtenerAtencion);

      if (this.obtenerAtencion.detalleSolicitudLibro.length > 0) {
        this.obtenerAtencion.detalleSolicitudLibro.forEach((x, i) => {
          this.arrayDetalle.push(x);
        });
      }
    });
  }

  showResponse(message: string) {
    this.utilService.getAlert('Aviso', message);
  }

  getFilesArray(arr: List[]): void {
    this.arrayFilesSustento = arr;
  }

  listarLenguas(): void {
    this.maestrosService.listLenguas().subscribe((data: LenguaOut) => {
      this.lenguaOut = data;
    }, error => {
    }, () => {
      if (this.lenguaOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.lenguaOut.message}`);
        return;
      }
      this.lengua = this.lenguaOut.data;
    });
  }

  listarArticulos(): void {
    this.maestrosService.listArticulos().subscribe((data: ArticuloOut) => {
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
    this.maestrosService.listTipoArchivos(idTipoUso).subscribe((data: TipoArchivoOut) => {
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

  btnCancelar(): void {
    this.utilService.link(this.environment.URL_MOD_GESTION_SOLICITUDES);
  }

  btnAddDetalle(): void {
    this.arrayDetalle.push(new DetalleSolicitudLibroRegistro());
  }

  btnDeleteDetalle(item: DetalleSolicitudLibroRegistro): void {
    this.arrayDetalle.splice(this.arrayDetalle.indexOf(item, 0), 1);
    this.obtenerAtencion.detalleSolicitudLibro.splice(this.obtenerAtencion.detalleSolicitudLibro.indexOf(item, 0), 1);
  }

  btnGrabar(): void {
    // GET ARRAY FROM CHILDREN COMPONENT
    let component: Step2LibroDetalleComponent[] = this.components.toArray();
    // GET ARRAY MAPPER DETALLE SOLICITUD
    let arrayDetalle: DetalleSolicitudLibroRegistro[] = component.map(value => value.setDetalleSolicitudAtencion());

    // VALIDACION 1
    if (this.arrayDetalle.length <= 0) {
      this.utilService.getAlert('Aviso', 'Debe añadir por lo menos un (1) detalle de material registral.');
      return;
    }

    // VALIDACIÓN 2
    this.uploadFileTipoSolicitud.setActivateValidation();
    const isFormValid = this.uploadFileTipoSolicitud.form.valid;
    if (!isFormValid) {
      this.utilService.getAlert('Aviso', 'Debe completar los datos requeridos como obligatorios (*)');
      return;
    }

    // MAPPER ARCHIVO SUSTENTO
    const archivoSustento = new Archivo;
    archivoSustento.codigoNombre = this.arrayFilesSustento[0].idFile;

    // MAPPER REGISTRO
    this.registroAtencionIn = new RegistroAtencionIn();
    this.registroAtencionIn.archivoRespuesta = archivoSustento;
    this.registroAtencionIn.codigoTipoArchivoRespuesta = this.arrayFilesSustento[0].fileTypeId;
    this.registroAtencionIn.detalleSolicitud = arrayDetalle;
    this.registroAtencionIn.numeroSolicitud = this.numeroSolicitud;

    const modalAtencion = this.utilService.getConfirmation('Confirmación', '¿Está seguro de registrar la atención?');
    modalAtencion.afterClosed().subscribe(result => {
      if (result) {
        this.gestionService.registroAtencion(this.registroAtencionIn).subscribe((data: RegistroAtencionOut) => {
          this.registroAtencionOut = data;
        }, error => {
        }, () => {
          if (this.registroAtencionOut.code !== this.environment.CODE_000) {
            this.utilService.getAlert(`Aviso:`, `${this.registroAtencionOut.message}`);
            return;
          }
          const modal = this.utilService.getAlert('Aviso', this.registroAtencionOut.message);
          modal.afterClosed().subscribe(result => {
            if (result) {
              this.utilService.link(this.environment.URL_MOD_GESTION_SOLICITUDES);
            }
          });
        });
      }
    });

  }

}
