import { Component, OnInit, ViewChild } from '@angular/core';
import { MaestrosService } from 'src/app/masters/services/maestros.service';
import { environment } from 'src/environments/environment';
import { UtilService } from '../../../../shared/services/util.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SeguridadService } from 'src/app/shared/services/seguridad.service';
import { GestionService } from 'src/app/core/gestion-solicitudes/services/gestion.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/auth/models/user.model';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import {
  ReporteData,
  ReporteOut,
  ReportesIn,
} from 'src/app/core/gestion-solicitudes/models/busquedaReporte.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OptionsComponent } from 'src/app/auth/components/options/options.component';
import { OptionsOut, Options } from 'src/app/masters/models/option.model';
import { formatDate } from '@angular/common';
import {
  ObtenerDetalleLibroOut,
  ObtenerDetalleFirmaOut,
  DetalleFirma,
  DetalleLibro,
} from 'src/app/core/gestion-solicitudes/models/gestion.model';
import { RpDetalleComponent } from 'src/app/core/reportes-excel/components/rp-detalle/rp-detalle.component';
import { RpDocumentoComponent } from 'src/app/core/reportes-excel/components/rp-documento/rp-documento.component';
import {
  BusquedaDetalleOut,
  ReporteDetalleExp,
} from '../../models/rdReporte.model';
import { RdServiceService } from '../../services/rd-service.service';

@Component({
  selector: 'app-rd-reporte-detalle',
  templateUrl: './rd-reporte-detalle.component.html',
  styleUrls: ['./rd-reporte-detalle.component.scss'],
})
export class RdReporteDetalleComponent implements OnInit {
  environment: any;
  limit!: any;
  length = 0;
  message!: string;
  solicitante: string = '';
  title!: string;
  bgColor!: any;

  contador: number = 12;

  form!: FormGroup;

  user?: User;
  subUser!: Subscription;

  dataResult!: MatTableDataSource<ReporteDetalleExp>;
  selection = new SelectionModel<ReporteDetalleExp>(true, []);

  //Variables de entrada
  codigoEstado: string = '';

  busquedaIn!: ReportesIn;
  busquedaOut!: BusquedaDetalleOut;

  estadoSolicitudOut!: OptionsOut;
  estadoSolicitud: Options[] = [];

  tipoRegistroOut!: OptionsOut;
  tipoRegistro: Options[] = [];

  analistasOut!: OptionsOut;
  analistas: Options[] = [];

  obtenerDetalleLibroOut!: ObtenerDetalleLibroOut;
  detalleLibro!: DetalleLibro;

  obtenerDetalleFirmaOut!: ObtenerDetalleFirmaOut;
  detalleFirma!: DetalleFirma;

  listaEstadoSolicitud!: ReporteDetalleExp[];

  @ViewChild('cboAnalista') cboAnalista!: OptionsComponent;
  @ViewChild('cboEstadoSolicitud') cboEstadoSolicitud!: OptionsComponent;
  @ViewChild('cboTipoRegistro') cboTipoRegistro!: OptionsComponent;

  //ESTRUCTURANDO VALORES DE LA TABLA
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  resetDep: boolean = false;
  displayedColumns: string[] = [
    'fechaRecepcion',
    'nroSolicitud',
    'fechaAsignacion',
    'departamento',
    'provincia',
    'distrito',
    'centroPoblado',
    'dni',
    'registradorCivil',
    'fechaAtencion',
    'detalleRegistro',
    'email',
    'celular',
    'analista',
    'plazo',
  ];

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataResult.data.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataResult.data);
  }

  constructor(
    private maestrosService: MaestrosService,
    public utilService: UtilService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private seguridadService: SeguridadService,
    private gestionService: GestionService,
    private spinner: NgxSpinnerService,
    private excelService: RdServiceService
  ) {
    this.subUser = this.seguridadService
      .getObsUser()
      .subscribe((data: User) => {
        this.user = data;
      });
  }

  ngOnInit(): void {
    this.title = 'Reportes Detalle';
    this.environment = environment;
    this.form = this.formBuilder.group({
      dniSolicitante: [''],
      apellidoPaterno: [''],
      apellidoMaterno: [''],
      codigoEstado: [this.codigoEstado],
      fechaIni: [''],
      fechaFin: [''],
      codigoDepartamento: [''],
      codigoProvincia: [''],
      codigoDistrito: [''],
      codigoOrec: [''],
      codigoTipoRegistro: [
        this.esAnalista() ? this.environment.TIPO_REGISTRO_LIBRO_ID : '',
      ],
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

  btnSearch() {
    this.getListaBusqueda();
  }

  getListaBusqueda(e?: PageEvent): void {
    this.length = 0;
    this.message = 'Cargando...';

    const fIni = this.form.controls['fechaIni'].value;
    const fFin = this.form.controls['fechaFin'].value;

    this.busquedaIn = new ReportesIn();
    this.busquedaIn = this.form.getRawValue();

    //nueva entrada ->
    this.solicitante = this.busquedaIn.dniSolicitante;
    this.busquedaIn.fechaFin = fIni ? formatDate(fIni, 'yyyy-MM-dd', 'EN') : '';
    this.busquedaIn.fechaFin = fFin ? formatDate(fFin, 'yyyy-MM-dd', 'EN') : '';
    this.busquedaIn.page = e ? e.pageIndex + 1 : this.environment.START_PAGE;
    this.busquedaIn.size = e ? e.pageSize : this.environment.ROWS_PAGE2;

    this.gestionService.listSolicitudesDetalle(this.busquedaIn).subscribe(
      (data: BusquedaDetalleOut) => {
        this.busquedaOut = data;
      },
      (error) => {},
      () => {
        if (this.busquedaOut.code !== this.environment.CODE_000) {
          this.message = this.busquedaOut.message;
          return;
        }
        //LIMPIANDO SECCION
        this.selection.clear();
        //ASIGNAR VALORES
        this.listaEstadoSolicitud = this.busquedaOut.data;

        console.log(this.listaEstadoSolicitud);

        //Validando Plazos
        this.listaEstadoSolicitud.forEach((item) => {
          if (item.fechaRecepcion && item.fechaAsignacion) {
            if (item.fechaRecepcion == null) {
              item.plazo = '';
            } else {
              if (item.fechaAtencion == null) {
                const fechaActual = new Date();

                const dateAtencionYearActual = fechaActual.getFullYear();
                const dateAtencionMonthActual = fechaActual.getMonth() + 1;
                // const dateAtecionDayActual = fechaActual.getDay();

                const dateAsignacionYear = item.fechaAsignacion.slice(6, 10);
                const dateAsignacionMonth = item.fechaAsignacion.slice(3, 5);
                // const dateAsignacionDay = item.fechaAsignacion.slice(0, 2);

                const year = Number(dateAsignacionYear);
                const month = Number(dateAsignacionMonth);
                // const day = Number(dateAsignacionDay);

                if (dateAtencionYearActual > year) {
                  item.plazo = 'FUERA DEL PLAZO';
                } else {
                  if (
                    dateAtencionMonthActual > month &&
                    dateAtencionMonthActual !== month
                  ) {
                    item.plazo = 'FUERA DEL PLAZO';
                  } else {
                    const dateAsig = item.fechaAsignacion.slice(0, 2);
                    const dateAte = fechaActual.getDate();
                    const fechaAsig = Number(dateAsig);
                    const fechaAte = Number(dateAte);
                    if (fechaAte < fechaAsig) {
                      item.plazo = 'FUERA DEL PLAZO';
                    } else {
                      if (fechaAte - fechaAsig > 3) {
                        item.plazo = 'FUERA DEL PLAZO';
                      } else {
                        item.plazo = 'DENTRO DEL PLAZO';
                      }
                    }
                  }
                }
              } else {
                const dateAtencionYear = item.fechaAtencion.slice(6, 10);
                const dateAtencionMonth = item.fechaAtencion.slice(3, 5);

                const dateAsignacionYear = item.fechaAsignacion.slice(6, 10);
                const dateAsignacionMonth = item.fechaAsignacion.slice(3, 5);

                const yearAtencion = Number(dateAtencionYear);
                const monthAtencion = Number(dateAtencionMonth);
                const yearAsignacion = Number(dateAsignacionYear);
                const monthAsignacion = Number(dateAsignacionMonth);

                if (yearAtencion > yearAsignacion) {
                  item.plazo = 'FUERA DEL PLAZO';
                } else {
                  if (
                    monthAtencion > monthAsignacion &&
                    monthAtencion !== monthAsignacion
                  ) {
                    item.plazo = 'FUERA DEL PLAZO';
                  } else {
                    const dateAsig = item.fechaAsignacion.slice(0, 2);
                    const dateAte = item.fechaAtencion?.slice(0, 2);

                    const fechaAsig = Number(dateAsig);
                    const fechaAte = Number(dateAte);

                    if (fechaAte - fechaAsig > 3) {
                      item.plazo = 'FUERA DEL PLAZO';
                    } else {
                      item.plazo = 'DENTRO DEL PLAZO';
                    }
                  }
                }
              }
            }
          }
        });

        this.dataResult = new MatTableDataSource<ReporteDetalleExp>(
          this.listaEstadoSolicitud
        );

        //concatenando data

        this.dataResult.sort = this.sort;
        this.length = this.busquedaOut.totalElements;
        if (!length || length <= 0) {
          this.message = 'No se encontraron registros';
        }
      }
    );
  }

  //fin
  getRowStyles(row: any) {
    if (!row.fechaRecepcion) return { '': '' };
    if (row.plazo == 'DENTRO DEL PLAZO') {
      return { 'background-color': 'rgba(0, 255, 42, 0.316)' };
    }
    if (row.plazo == 'FUERA DEL PLAZO') {
      return { 'background-color': ' rgba(255, 72, 0, 0.316)' };
    }
    return { '': '' };
  }

  exportarXlsx() {
    this.excelService.exportToExcel(this.dataResult, 'Myexport');
  }

  exportarTodoXlsx() {
    this.busquedaIn.size = 9999;

    this.busquedaIn.page = this.environment.START_PAGE;

    this.gestionService.listSolicitudesDetalle(this.busquedaIn).subscribe(
      (data: BusquedaDetalleOut) => {
        this.busquedaOut = data;
      },
      (error) => {},
      () => {
        if (this.busquedaOut.code !== this.environment.CODE_000) {
          return;
        }

        this.busquedaIn.size = this.paginator.pageSize;
        this.busquedaIn.page = this.paginator.pageIndex + 1;

        this.listaEstadoSolicitud = this.busquedaOut.data;

        this.listaEstadoSolicitud.forEach((item) => {
          if (item.fechaRecepcion && item.fechaAsignacion) {
            if (item.fechaRecepcion == null) {
              item.plazo = '';
            } else {
              if (item.fechaAtencion == null) {
                const fechaActual = new Date();

                const dateAtencionYearActual = fechaActual.getFullYear();
                const dateAtencionMonthActual = fechaActual.getMonth() + 1;
                // const dateAtecionDayActual = fechaActual.getDay();

                const dateAsignacionYear = item.fechaAsignacion.slice(6, 10);
                const dateAsignacionMonth = item.fechaAsignacion.slice(3, 5);
                // const dateAsignacionDay = item.fechaAsignacion.slice(0, 2);

                const year = Number(dateAsignacionYear);
                const month = Number(dateAsignacionMonth);
                // const day = Number(dateAsignacionDay);

                if (dateAtencionYearActual > year) {
                  item.plazo = 'FUERA DEL PLAZO';
                } else {
                  if (
                    dateAtencionMonthActual > month &&
                    dateAtencionMonthActual !== month
                  ) {
                    item.plazo = 'FUERA DEL PLAZO';
                  } else {
                    const dateAsig = item.fechaAsignacion.slice(0, 2);
                    const dateAte = fechaActual.getDate();
                    const fechaAsig = Number(dateAsig);
                    const fechaAte = Number(dateAte);
                    if (fechaAte < fechaAsig) {
                      item.plazo = 'FUERA DEL PLAZO';
                    } else {
                      if (fechaAte - fechaAsig > 3) {
                        item.plazo = 'FUERA DEL PLAZO';
                      } else {
                        item.plazo = 'DENTRO DEL PLAZO';
                      }
                    }
                  }
                }
              } else {
                const dateAtencionYear = item.fechaAtencion.slice(6, 10);
                const dateAtencionMonth = item.fechaAtencion.slice(3, 5);

                const dateAsignacionYear = item.fechaAsignacion.slice(6, 10);
                const dateAsignacionMonth = item.fechaAsignacion.slice(3, 5);

                const yearAtencion = Number(dateAtencionYear);
                const monthAtencion = Number(dateAtencionMonth);
                const yearAsignacion = Number(dateAsignacionYear);
                const monthAsignacion = Number(dateAsignacionMonth);

                if (yearAtencion > yearAsignacion) {
                  item.plazo = 'FUERA DEL PLAZO';
                } else {
                  if (
                    monthAtencion > monthAsignacion &&
                    monthAtencion !== monthAsignacion
                  ) {
                    item.plazo = 'FUERA DEL PLAZO';
                  } else {
                    const dateAsig = item.fechaAsignacion.slice(0, 2);
                    const dateAte = item.fechaAtencion?.slice(0, 2);

                    const fechaAsig = Number(dateAsig);
                    const fechaAte = Number(dateAte);

                    if (fechaAte - fechaAsig > 3) {
                      item.plazo = 'FUERA DEL PLAZO';
                    } else {
                      item.plazo = 'DENTRO DEL PLAZO';
                    }
                  }
                }
              }
            }
          }
        });

        const allData = new MatTableDataSource<ReporteDetalleExp>(
          this.listaEstadoSolicitud
        );
        this.excelService.exportToExcel(allData, 'Myexport');
        this.busquedaIn.size = this.environment.ROWS_PAG;
      }
    );
  }

  getEstadosSolicitud(): void {
    this.maestrosService.listEstadoSolicitud().subscribe(
      (data: OptionsOut) => {
        this.estadoSolicitudOut = data;
      },
      (error) => {},
      () => {
        if (this.estadoSolicitudOut.code !== this.environment.CODE_000) {
          this.utilService.getAlert(
            `Aviso:`,
            `${this.estadoSolicitudOut.message}`
          );
          return;
        }
        this.estadoSolicitud = this.estadoSolicitudOut.data;
        this.estadoSolicitud.sort((a, b) =>
          a.descripcion > b.descripcion ? 1 : -1
        );
      }
    );
  }

  clearDate(formControl: string[]) {
    formControl.forEach((item) => {
      this.form.controls[item].setValue('');
    });
  }

  setEstadoSolicitud(id: any) {
    this.form.controls['codigoEstado'].setValue(id);
    // this.getListaBusqueda();
  }

  getTipoRegistro(): void {
    this.maestrosService.listTipoRegistro().subscribe(
      (data: OptionsOut) => {
        this.tipoRegistroOut = data;
      },

      (error) => {},
      () => {
        if (this.tipoRegistroOut.code !== this.environment.CODE_000) {
          this.utilService.getAlert(
            `Aviso:`,
            `${this.tipoRegistroOut.message}`
          );
          return;
        }
        if (this.esAnalista()) {
          this.tipoRegistro = this.tipoRegistroOut.data.filter(
            (x) => x.codigo === this.environment.TIPO_REGISTRO_LIBRO_ID
          );
        } else {
          this.tipoRegistro = this.tipoRegistroOut.data;
        }
      }
    );
  }

  setTipoRegistro(id: any) {
    this.form.controls['codigoTipoRegistro'].setValue(id);
  }

  getAnalistas(): void {
    this.maestrosService.listAnalistas().subscribe(
      (data: OptionsOut) => {
        this.analistasOut = data;
      },
      (error) => {},
      () => {
        if (this.analistasOut.code !== this.environment.CODE_000) {
          this.utilService.getAlert(`Aviso:`, `${this.analistasOut.message}`);
          return;
        }
        if (this.esAnalista()) {
          this.analistas = this.analistasOut.data.filter(
            (x) => x.codigo === this.user?.dni
          );
        } else {
          this.analistas = this.analistasOut.data;
        }
      }
    );
  }

  setAnalista(id: any) {
    this.form.controls['codigoAnalistaAsignado'].setValue(id);
  }

  getDetalle(title: string, detalle: any, tipo: string) {
    return this.dialog.open(RpDetalleComponent, {
      width: '1100px',
      data: { title: title, detalle: detalle, tipo: tipo },
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

  btnDoc(row: ReporteData) {
    if (!row.tipoRegistro) {
      this.utilService.getAlert(
        'Aviso',
        'No se ha obtenido el tipo de registro.'
      );
      return;
    }

    if (row.tipoRegistro === this.environment.TIPO_REGISTRO_LIBRO) {
      this.spinner.show();
      this.gestionService.getDetailLibro(row.numeroSolicitud).subscribe(
        (data: ObtenerDetalleLibroOut) => {
          this.spinner.hide();
          this.obtenerDetalleLibroOut = data;
        },
        (error) => {
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          if (this.obtenerDetalleLibroOut.code !== this.environment.CODE_000) {
            this.utilService.getAlert(
              `Aviso:`,
              `${this.obtenerDetalleLibroOut.message}`
            );
            return;
          }
          this.detalleLibro = this.obtenerDetalleLibroOut.data;
          this.getDetalleDocumento(
            'Documentos de Atención',
            this.detalleLibro,
            row.tipoRegistro
          );
        }
      );
    }

    if (row.tipoRegistro === this.environment.TIPO_REGISTRO_FIRMA) {
      this.spinner.show();
      this.gestionService.getDetailFirma(row.numeroSolicitud).subscribe(
        (data: ObtenerDetalleFirmaOut) => {
          this.spinner.hide();
          this.obtenerDetalleFirmaOut = data;
        },
        (error) => {
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          if (this.obtenerDetalleFirmaOut.code !== this.environment.CODE_000) {
            this.utilService.getAlert(
              `Aviso:`,
              `${this.obtenerDetalleFirmaOut.message}`
            );
            return;
          }
          this.detalleFirma = this.obtenerDetalleFirmaOut.data;
          this.getDetalleDocumento(
            'Documentos de Atención',
            this.detalleFirma,
            row.tipoRegistro
          );
        }
      );
    }
  }

  getDetalleDocumento(title: string, detalle: any, tipo: string) {
    return this.dialog.open(RpDocumentoComponent, {
      width: '1100px',
      data: { title: title, detalle: detalle, tipo: tipo },
    });
  }
}
