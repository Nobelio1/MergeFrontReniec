import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OptionsComponent } from 'src/app/masters/components/options/options.component';
import { Options, OptionsOut } from 'src/app/masters/models/option.model';
import { MaestrosService } from 'src/app/masters/services/maestros.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { User } from 'src/app/auth/models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { SeguridadService } from 'src/app/shared/services/seguridad.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { formatDate } from '@angular/common';
import { GestionService } from 'src/app/core/gestion-solicitudes/services/gestion.service';
import { MatSort } from '@angular/material/sort';
import {
  ReporteOut,
  ReportesIn,
  ReporteData,
} from 'src/app/core/gestion-solicitudes/models/busquedaReporte.model';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DetalleFirma,
  DetalleLibro,
  ObtenerDetalleFirmaOut,
  ObtenerDetalleLibroOut,
} from 'src/app/core/gestion-solicitudes/models/gestion.model';
import { RpDetalleComponent } from '../rp-detalle/rp-detalle.component';
import { RpDocumentoComponent } from '../rp-documento/rp-documento.component';
import { ExcelExportService } from '../../services/reportes.service';

@Component({
  selector: 'app-rp-reporte',
  templateUrl: './rp-reporte.component.html',
  styleUrls: ['./rp-reporte.component.scss'],
})
export class RpReporteComponent implements OnInit {
  environment: any;
  message!: string;
  limit!: any;
  length = 0;
  solicitante: string = '';
  bgColor!: any;

  //VARIABLES CENTRALES PARA LA TABLA
  dataResult!: MatTableDataSource<ReporteData>;
  selection = new SelectionModel<ReporteData>(true, []);

  title!: string;
  form!: FormGroup;

  user?: User;
  subUser!: Subscription;

  //CREANDO MODELOS LAS BUSQUEDAS
  busquedaIn!: ReportesIn;
  busquedaOut!: ReporteOut;

  estadoSolicitudOut!: OptionsOut;
  estadoSolicitud: Options[] = [];

  tipoRegistroOut!: OptionsOut;
  tipoRegistro: Options[] = [];

  analistasOut!: OptionsOut;
  analistas: Options[] = [];

  //Model Views
  obtenerDetalleLibroOut!: ObtenerDetalleLibroOut;
  detalleLibro!: DetalleLibro;

  obtenerDetalleFirmaOut!: ObtenerDetalleFirmaOut;
  detalleFirma!: DetalleFirma;

  listaEstadoSolicitud!: ReporteData[];

  fecIni = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    new Date().getDate()
  );
  fecFin = new Date();

  @ViewChild('cboAnalista') cboAnalista!: OptionsComponent;
  @ViewChild('cboEstadoSolicitud') cboEstadoSolicitud!: OptionsComponent;
  @ViewChild('cboTipoRegistro') cboTipoRegistro!: OptionsComponent;

  //ESTRUCTURANDO VALORES DE LA TABLA
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  resetDep: boolean = false;
  displayedColumns: string[] = [
    'nroSolicitud',
    'fechaRegistro',
    'tipoRegistro',
    'oficinaAutorizada',
    'solicitante',
    'fechaRecepcion',
    'fechaAsignacion',
    'fechaAtencion',
    'analistaAsignado',
    'estado',
    'detalleSolicitud',
    'docAtencion',
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

  //Opcion predeterminada
  codigoEstado: string = '';

  constructor(
    private maestrosService: MaestrosService,
    public utilService: UtilService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private seguridadService: SeguridadService,
    private gestionService: GestionService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelExportService
  ) {
    this.subUser = this.seguridadService
      .getObsUser()
      .subscribe((data: User) => {
        this.user = data;
      });
  }

  ngOnInit(): void {
    this.title = 'Reportes';
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

    this.solicitante = this.busquedaIn.dniSolicitante; // PROV

    this.busquedaIn.fechaIni = fIni ? formatDate(fIni, 'yyyy-MM-dd', 'EN') : '';
    this.busquedaIn.fechaFin = fFin ? formatDate(fFin, 'yyyy-MM-dd', 'EN') : '';
    this.busquedaIn.page = e ? e.pageIndex + 1 : this.environment.START_PAGE;
    this.busquedaIn.size = e ? e.pageSize : this.environment.ROWS_PAGE;

    this.gestionService.listSolicitudes(this.busquedaIn).subscribe(
      (data: ReporteOut) => {
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

        this.dataResult = new MatTableDataSource<ReporteData>(
          this.listaEstadoSolicitud
        );

        console.log(this.listaEstadoSolicitud.length);

        this.dataResult.sort = this.sort;
        this.length = this.busquedaOut.totalElements;
        if (!length || length <= 0) {
          this.message = 'No se encontraron registros';
        }
      }
    );
  }

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

    this.gestionService.listSolicitudes(this.busquedaIn).subscribe(
      (data: ReporteOut) => {
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

        const allData = new MatTableDataSource<ReporteData>(
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

  btnView(row: ReporteData): void {
    if (!row.tipoRegistro) {
      this.utilService.getAlert(
        'Aviso',
        'No se ha obtenido el tipo de registro.'
      );
      return;
    }

    // LIBRO
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
          // ENVIAR RESPONSE A MODAL DETALLE
          this.getDetalle(
            'Detalle de Solicitud',
            this.detalleLibro,
            row.tipoRegistro
          );
        }
      );
    }

    // FIRMA - Muestra fomatos - FORMATO A SEGUIR
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
          // ENVIAR RESPONSE A MODAL DETALLE
          this.getDetalle(
            'Detalle de Solicitud',
            this.detalleFirma,
            row.tipoRegistro
          );
        }
      );
    }
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
