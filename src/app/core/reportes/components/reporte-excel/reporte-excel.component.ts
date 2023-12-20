import { Component, Input, Output, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Options, OptionsOut } from 'src/app/masters/models/option.model';
import { User } from 'src/app/auth/models/user.model';
import { OptionsComponent } from 'src/app/masters/components/options/options.component';
import { MaestrosService } from 'src/app/masters/services/maestros.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  BusquedaData,
  BusquedaIn,
  BusquedaOut,
} from 'src/app/core/gestion-solicitudes/models/busqueda.model';
import { MatTableDataSource } from '@angular/material/table';
import { GestionService } from 'src/app/core/gestion-solicitudes/services/gestion.service';
import { formatDate } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-reporte-excel',
  templateUrl: './reporte-excel.component.html',
  styleUrls: ['./reporte-excel.component.css'],
})
export class ReporteExcelComponent implements OnInit {
  environment: any;
  title!: string;
  length = 0;
  message!: string;
  codigoEstado: string = '3';

  @Input() select: string = '';
  @Input() optionSelect: boolean = true;

  form!: FormGroup;

  @ViewChild('cboEstadoSolicitud') cboEstadoSolicitud!: OptionsComponent;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  displayedColumns: string[] = [
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

  tipoRegistroOut!: OptionsOut;
  tipoRegistro: Options[] = [];

  busquedaIn!: BusquedaIn;
  busquedaOut!: BusquedaOut;

  estadoSolicitudOut!: OptionsOut;
  estadoSolicitud: Options[] = [];

  listaEstadoSolicitud!: BusquedaData[];

  user!: User;

  dataResult!: MatTableDataSource<BusquedaData>;
  selection = new SelectionModel<BusquedaData>(true, []);

  @ViewChild('cboTipoRegistro') cboTipoRegistro!: OptionsComponent;

  constructor(
    private formBuilder: FormBuilder,
    private maestrosService: MaestrosService,
    public utilService: UtilService,
    private gestionService: GestionService
  ) {}

  ngOnInit(): void {
    this.environment = environment;
    this.title = 'Reportes';

    this.form = this.formBuilder.group({
      codigoTipoRegistro: [
        this.esAnalista() ? this.environment.TIPO_REGISTRO_LIBRO_ID : 'AAA',
      ],
      codigoEstado: [this.codigoEstado],
    });
    this.getTipoRegistro();
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

    this.gestionService.listSolicitudes(this.busquedaIn).subscribe(
      (data: BusquedaOut) => {
        this.busquedaOut = data;
      },
      (error) => {},
      () => {
        if (this.busquedaOut.code !== this.environment.CODE_000) {
          this.message = this.busquedaOut.message;
          return;
        }
        // CLEAR SELECTION
        this.selection.clear();
        this.listaEstadoSolicitud = this.busquedaOut.data;
        this.dataResult = new MatTableDataSource<BusquedaData>(
          this.listaEstadoSolicitud
        );
        this.dataResult.sort = this.sort;
        this.length = this.busquedaOut.totalElements;
        if (!length || length <= 0) {
          this.message = 'No se encontraron registros.';
        }
      }
    );
  }

  esAnalista(): boolean {
    return this.user?.perfil.codigo === this.environment.PERFIL_ANALISTA;
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

  getOficinaAutorizada(idOficinaOrec: string) {
    this.form.controls['codigoOrec'].setValue(idOficinaOrec);
  }

  setTipoRegistro(id: any) {
    this.form.controls['codigoTipoRegistro'].setValue(id);
  }

  clearDate(formControl: string[]) {
    formControl.forEach((item) => {
      this.form.controls[item].setValue('');
    });
  }
}
