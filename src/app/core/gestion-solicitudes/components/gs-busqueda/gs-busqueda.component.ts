import {Component, OnInit, ViewChild} from '@angular/core';
import { environment } from 'src/environments/environment';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UtilService} from "../../../../shared/services/util.service";
import {BusquedaData, BusquedaIn, BusquedaOut} from "../../models/busqueda.model";
import {
  OficinaAutorizadaComponent
} from "../../../../masters/components/oficina-autorizada/oficina-autorizada.component";
import {formatDate} from "@angular/common";
import {GestionService} from "../../services/gestion.service";
import {OptionsComponent} from "../../../../masters/components/options/options.component";
import {MaestrosService} from "../../../../masters/services/maestros.service";
import {Options, OptionsOut} from "../../../../masters/models/option.model";
import {SelectionModel} from "@angular/cdk/collections";
import {
  AsignarIn,
  AsignarOut, DetalleFirma,
  DetalleLibro, EliminarSolicitudIn, EliminarSolicitudOut, ObtenerDetalleFirmaOut,
  ObtenerDetalleLibroOut,
  RecepcionarIn,
  RecepcionarOut
} from "../../models/gestion.model";
import {GsAnalistaComponent} from "../gs-analista/gs-analista.component";
import {MatDialog} from "@angular/material/dialog";
import {GsDetalleComponent} from "../gs-detalle/gs-detalle.component";
import {NgxSpinnerService} from "ngx-spinner";
import {User} from "../../../../auth/models/user.model";
import {Subscription} from "rxjs";
import {SeguridadService} from "../../../../shared/services/seguridad.service";
import { GsEditarComponent } from '../gs-editar/gs-editar.component';

@Component({
  selector: 'app-gs-busqueda',
  templateUrl: './gs-busqueda.component.html',
  styleUrls: ['./gs-busqueda.component.scss']
})
export class GsBusquedaComponent implements OnInit {

  environment: any;
  title!: string;

  form!: FormGroup;

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  displayedColumns: string[] = [
    'nroSolicitud',
    'fechaRegistro',
    'tipoRegistro',
    'oficinaAutorizada',
    'fechaRecepcion',
    'fechaAsignacion',
    'fechaAtencion',
    'analistaAsignado',
    'estado',
    'select',
    'acciones',
  ];
  dataResult!: MatTableDataSource<BusquedaData>;
  selection = new SelectionModel<BusquedaData>(true, []);
  length = 0;
  limit!: any;

  busquedaIn!: BusquedaIn;
  busquedaOut!: BusquedaOut;

  recepcionarIn!: RecepcionarIn;
  recepcionarOut!: RecepcionarOut;

  asignarIn!: AsignarIn;
  asignarOut!: AsignarOut;

  eliminarOut!: EliminarSolicitudOut;

  listaEstadoSolicitud!: BusquedaData[];

  fecIni = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate());
  fecFin = new Date();

  message!: string;

  analistasOut!: OptionsOut;
  analistas: Options[] = [];

  estadoSolicitudOut!: OptionsOut;
  estadoSolicitud: Options[] = [];

  tipoRegistroOut!: OptionsOut;
  tipoRegistro: Options[] = [];

  // DETALLES LIBRO & FIRMA
  obtenerDetalleLibroOut!: ObtenerDetalleLibroOut;
  detalleLibro!: DetalleLibro;

  obtenerDetalleFirmaOut!: ObtenerDetalleFirmaOut;
  detalleFirma!: DetalleFirma;

  @ViewChild('cboOficinaAutorizada') cboOficinaAutorizada!: OficinaAutorizadaComponent;
  @ViewChild('cboAnalista') cboAnalista!: OptionsComponent;
  @ViewChild('cboEstadoSolicitud') cboEstadoSolicitud!: OptionsComponent;
  @ViewChild('cboTipoRegistro') cboTipoRegistro!: OptionsComponent;
  resetDep: boolean = false;
  codigoEstado: string = '3';
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataResult.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataResult.data);
  }

  user?: User;
  subUser!: Subscription;

  constructor(private formBuilder: FormBuilder,
              public utilService: UtilService,
              private seguridadService: SeguridadService,
              private gestionService: GestionService,
              private maestrosService: MaestrosService,
              private spinner: NgxSpinnerService,
              public dialog: MatDialog) {
    this.subUser = this.seguridadService.getObsUser().subscribe((data: User) => {
      this.user = data;
    });
  }

  ngOnInit(): void {

    this.environment = environment;
    this.title = 'Gestión de Solicitudes';

    this.form = this.formBuilder.group({
      numeroSolicitud: [''],
      codigoEstado: [this.codigoEstado],
      fechaIni: [''],
      fechaFin: [''],
      codigoTipoRegistro: [this.esAnalista() ? this.environment.TIPO_REGISTRO_LIBRO_ID : ''],
      codigoDepartamento: [''],
      codigoProvincia: [''],
      codigoDistrito: [''],
      codigoOrec: [''],
      codigoAnalistaAsignado: [this.esAnalista() ? this.user?.dni : ''],
    });

    this.getAnalistas();
    this.getEstadosSolicitud();
    this.getTipoRegistro();
    this.getListaBusqueda();
  }

  esAnalista(): boolean {
    return this.user?.perfil.codigo === this.environment.PERFIL_ANALISTA;
  }

  btnClean() {
    this.form.reset();
    this.resetDep = true;
    this.cboEstadoSolicitud.form.controls['id'].setValue(this.codigoEstado);
    // this.form.controls['numeroSolicitud'].setValue('');
    //this.form.controls['codigoEstado'].setValue('3');
    // this.form.controls['fechaIni'].setValue('');
    // this.form.controls['fechaFin'].setValue('');
    // this.form.controls['codigoTipoRegistro'].setValue('');
    // this.form.controls['codigoDepartamento'].setValue('');
    // this.form.controls['codigoProvincia'].setValue('');
    // this.form.controls['codigoDistrito'].setValue('');
    // this.form.controls['codigoOrec'].setValue('');
    // this.form.controls['codigoAnalistaAsignado'].setValue('');
    if (!this.esAnalista()) {
      this.cboTipoRegistro.form.controls['id'].setValue('');
      this.cboAnalista.form.controls['id'].setValue('');
    }
  }

  btnSearch() {
    this.getListaBusqueda();
  }

  getListaBusqueda(e?: PageEvent): void {
    this.length = 0;
    this.message = 'Cargando...';

    const fIni = this.form.controls['fechaIni'].value;
    const fFin = this.form.controls['fechaFin'].value;

    this.busquedaIn = new BusquedaIn();
    this.busquedaIn = this.form.getRawValue();
    this.busquedaIn.fechaIni = fIni ? formatDate(fIni, 'yyyy-MM-dd', 'EN') : '';
    this.busquedaIn.fechaFin = fFin ? formatDate(fFin, 'yyyy-MM-dd', 'EN') : '';
    this.busquedaIn.page = e ? e.pageIndex + 1 : this.environment.START_PAGE;
    this.busquedaIn.size = e ? e.pageSize : this.environment.ROWS_PAGE;

    this.gestionService.listSolicitudes(this.busquedaIn).subscribe((data: BusquedaOut) => {
      this.busquedaOut = data;
    }, error => {
    }, () => {
      if (this.busquedaOut.code !== this.environment.CODE_000) {
        this.message = this.busquedaOut.message;
        return;
      }
      // CLEAR SELECTION
      this.selection.clear();
      this.listaEstadoSolicitud = this.busquedaOut.data;
      this.dataResult = new MatTableDataSource<BusquedaData>(this.listaEstadoSolicitud);
      this.dataResult.sort = this.sort;
      this.length = this.busquedaOut.totalElements;
      if (!length || length <= 0) {
        this.message = 'No se encontraron registros.';
      }
    });
  }

  btnAtender(row: BusquedaData): void {
    if (!row.numeroSolicitud) {
      this.utilService.getAlert('Aviso', 'No se ha obtenido el número de solicitud.');
      return;
    }

    this.utilService.link(this.environment.URL_MOD_GESTION_SOLICITUDES_ATENCION, row.numeroSolicitud);

  }

  btnView(row: BusquedaData): void {
    if (!row.tipoRegistro) {
      this.utilService.getAlert('Aviso', 'No se ha obtenido el tipo de registro.');
      return;
    }

    // LIBRO
    if (row.tipoRegistro === this.environment.TIPO_REGISTRO_LIBRO) {
      this.spinner.show();
      this.gestionService.getDetailLibro(row.numeroSolicitud).subscribe((data: ObtenerDetalleLibroOut) => {
        this.spinner.hide();
        this.obtenerDetalleLibroOut = data;
      }, error => {
        this.spinner.hide();
      }, () => {
        this.spinner.hide();
        if (this.obtenerDetalleLibroOut.code !== this.environment.CODE_000) {
          this.utilService.getAlert(`Aviso:`, `${this.obtenerDetalleLibroOut.message}`);
          return;
        }
        this.detalleLibro = this.obtenerDetalleLibroOut.data;
        // ENVIAR RESPONSE A MODAL DETALLE
        this.getDetalle('Detalle de Solicitud', this.detalleLibro, row.tipoRegistro);
      });
    }

    // FIRMA
    if (row.tipoRegistro === this.environment.TIPO_REGISTRO_FIRMA) {
      this.spinner.show();
      this.gestionService.getDetailFirma(row.numeroSolicitud).subscribe((data: ObtenerDetalleFirmaOut) => {
        this.spinner.hide();
        this.obtenerDetalleFirmaOut = data;
      }, error => {
        this.spinner.hide();
      }, () => {
        this.spinner.hide();
        if (this.obtenerDetalleFirmaOut.code !== this.environment.CODE_000) {
          this.utilService.getAlert(`Aviso:`, `${this.obtenerDetalleFirmaOut.message}`);
          return;
        }
        this.detalleFirma = this.obtenerDetalleFirmaOut.data;
        // ENVIAR RESPONSE A MODAL DETALLE
        this.getDetalle('Detalle de Solicitud', this.detalleFirma, row.tipoRegistro);
      });
    }
  }

  btnEliminar(row: BusquedaData): void {
    let eliminarRequest: EliminarSolicitudIn;
    eliminarRequest = new EliminarSolicitudIn();
    eliminarRequest.numeroSolicitud = row.numeroSolicitud;

    const modalElinminar = this.utilService.getConfirmation('Eliminar', `Ud. eliminará la solicitud ${row.numeroSolicitud}, <br> ¿es conforme?.`);
    modalElinminar.afterClosed().subscribe(result => {
      if (result) {
        this.gestionService.eliminarSolicitud(eliminarRequest).subscribe((data: EliminarSolicitudOut) => {
          if(data.data){
            this.utilService.getAlert(`Aviso:`, `La solicitud fue eliminada correctamente.`);
            this.getListaBusqueda();
          }          
        }, error => {
        }, () => {
          if (this.recepcionarOut.code !== this.environment.CODE_000) {
            this.utilService.getAlert(`Aviso:`, `${this.recepcionarOut.message}`);
            return;
          }
          this.utilService.getAlert(`Aviso:`, `${this.recepcionarOut.data}`);
        });
      }
    });

  }

  getDetalle(title: string, detalle: any, tipo: string) {
    return this.dialog.open(GsDetalleComponent, {
      width: '1100px',
      data: {title: title, detalle: detalle, tipo: tipo},
    });
  }

  btnEditar(row: BusquedaData): void {
    if (!row.tipoRegistro) {
      this.utilService.getAlert('Aviso', 'No se ha obtenido el tipo de registro.');
      return;
    }

    // LIBRO
    if (row.tipoRegistro === this.environment.TIPO_REGISTRO_LIBRO) {
      this.spinner.show();
      this.gestionService.getDetailLibro(row.numeroSolicitud).subscribe((data: ObtenerDetalleLibroOut) => {
        this.spinner.hide();
        this.obtenerDetalleLibroOut = data;
      }, error => {
        this.spinner.hide();
      }, () => {
        this.spinner.hide();
        if (this.obtenerDetalleLibroOut.code !== this.environment.CODE_000) {
          this.utilService.getAlert(`Aviso:`, `${this.obtenerDetalleLibroOut.message}`);
          return;
        }
        this.detalleLibro = this.obtenerDetalleLibroOut.data;
        // ENVIAR RESPONSE A MODAL EDITAR
        this.openEditarSolicitud(this.detalleLibro, row.tipoRegistro);
      });
    }

    // FIRMA
    if (row.tipoRegistro === this.environment.TIPO_REGISTRO_FIRMA) {
      this.spinner.show();
      this.gestionService.getDetailFirma(row.numeroSolicitud).subscribe((data: ObtenerDetalleFirmaOut) => {
        this.spinner.hide();
        this.obtenerDetalleFirmaOut = data;
      }, error => {
        this.spinner.hide();
      }, () => {
        this.spinner.hide();
        if (this.obtenerDetalleFirmaOut.code !== this.environment.CODE_000) {
          this.utilService.getAlert(`Aviso:`, `${this.obtenerDetalleFirmaOut.message}`);
          return;
        }
        this.detalleFirma = this.obtenerDetalleFirmaOut.data;
        // ENVIAR RESPONSE A MODAL EDITAR
        this.openEditarSolicitud(this.detalleFirma, row.tipoRegistro);
      });
    }
  }

  openEditarSolicitud(detalle: any, tipo: string){
    return this.dialog.open(GsEditarComponent, {
      width: '1100px',
      disableClose: true,
      data: {detalle: detalle, tipo: tipo},
    });
  }

  btnRecepcionar(): void {
    const array: string[] = this.selection.selected.map(value => value.numeroSolicitud);

    if (array.length <= 0) {
      this.utilService.getAlert('Aviso', 'Debe seleccionar un registro.');
      return;
    }

    this.recepcionarIn = new RecepcionarIn();
    this.recepcionarIn.solicitudes = array;

    const modalRecepcion = this.utilService.getConfirmation('Recepcionar', `Ud. recepcionará ${array.length} <br> solicitud(es), ¿es conforme?.`);
    modalRecepcion.afterClosed().subscribe(result => {
      if (result) {
        this.gestionService.recepcionar(this.recepcionarIn).subscribe((data: RecepcionarOut) => {
          this.recepcionarOut = data;
        }, error => {
        }, () => {
          if (this.recepcionarOut.code !== this.environment.CODE_000) {
            this.utilService.getAlert(`Aviso:`, `${this.recepcionarOut.message}`);
            return;
          }
          this.utilService.getAlert(`Aviso:`, `${this.recepcionarOut.data}`);
          this.getListaBusqueda();
          this.selection.clear();
        });
      }
    });
  }

  btnAsignar(): void {
    const array: string[] = this.selection.selected.map(value => value.numeroSolicitud);

    if (array.length <= 0) {
      this.utilService.getAlert('Aviso', 'Debe seleccionar un registro.');
      return;
    }

    const modalAsignacion = this.getAnalista('Asignación', this.analistas);
    modalAsignacion.afterClosed().subscribe(result => {
      if (result.sw) {
        this.asignarIn = new AsignarIn();
        this.asignarIn.codigoAnalista = result.id;
        this.asignarIn.solicitudes = array;

        this.gestionService.asignar(this.asignarIn).subscribe((data: AsignarOut) => {
          this.asignarOut = data;
        }, error => {
        }, () => {
          if (this.asignarOut.code !== this.environment.CODE_000) {
            this.utilService.getAlert(`Aviso:`, `${this.asignarOut.message}`);
            return;
          }
          this.utilService.getAlert(`Aviso:`, `${this.asignarOut.data}`);
          this.getListaBusqueda();
          this.selection.clear();
        });
      }
    });
  }

  getAnalista(title: string, options: Options[]) {
    return this.dialog.open(GsAnalistaComponent, {
      width: '450px',
      data: {title: title, options: options},
    });
  }

  clearDate(formControl: string[]) {
    formControl.forEach(item => {
      this.form.controls[item].setValue('');
    });
  }

  getDep(ubigeo: string) {
    this.resetDep = false;
    this.form.controls['codigoDepartamento'].setValue(ubigeo);

    this.form.controls['codigoProvincia'].setValue('');
    this.form.controls['codigoDistrito'].setValue('');
    this.form.controls['codigoOrec'].setValue('');
  }

  getPro(ubigeo: string) {
    this.form.controls['codigoProvincia'].setValue(ubigeo);

    this.form.controls['codigoDistrito'].setValue('');
    this.form.controls['codigoOrec'].setValue('');
  }

  getDis(ubigeo: string) {
    this.form.controls['codigoDistrito'].setValue(ubigeo);

    this.form.controls['codigoOrec'].setValue('');
  }

  getOficinaAutorizada(idOficinaOrec: string) {
    this.form.controls['codigoOrec'].setValue(idOficinaOrec);
  }

  getAnalistas(): void {
    this.maestrosService.listAnalistas().subscribe((data: OptionsOut) => {
      this.analistasOut = data;
    }, error => {
    }, () => {
      if (this.analistasOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.analistasOut.message}`);
        return;
      }
      if (this.esAnalista()) {
        this.analistas = this.analistasOut.data.filter(x => x.codigo === this.user?.dni);
      } else {
        this.analistas = this.analistasOut.data;
      }
    });
  }

  setAnalista(id: any) {
    this.form.controls['codigoAnalistaAsignado'].setValue(id);
  }

  getEstadosSolicitud(): void {
    this.maestrosService.listEstadoSolicitud().subscribe((data: OptionsOut) => {
      this.estadoSolicitudOut = data;
    }, error => {
    }, () => {
      if (this.estadoSolicitudOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.estadoSolicitudOut.message}`);
        return;
      }
      this.estadoSolicitud = this.estadoSolicitudOut.data;
    });
  }

  setEstadoSolicitud(id: any) {
    this.form.controls['codigoEstado'].setValue(id);
    this.getListaBusqueda();
  }

  getTipoRegistro(): void {
    this.maestrosService.listTipoRegistro().subscribe((data: OptionsOut) => {
      this.tipoRegistroOut = data;
    }, error => {
    }, () => {
      if (this.tipoRegistroOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert(`Aviso:`, `${this.tipoRegistroOut.message}`);
        return;
      }
      if (this.esAnalista()) {
        this.tipoRegistro = this.tipoRegistroOut.data.filter(x => x.codigo === this.environment.TIPO_REGISTRO_LIBRO_ID);
      } else {
        this.tipoRegistro = this.tipoRegistroOut.data;
      }
    });
  }

  setTipoRegistro(id: any) {
    this.form.controls['codigoTipoRegistro'].setValue(id);
  }

}
