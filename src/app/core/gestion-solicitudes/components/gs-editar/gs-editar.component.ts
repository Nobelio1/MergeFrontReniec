import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { GetFileData, GetFileOut } from 'src/app/shared/models/upload-file.model';
import { environment } from 'src/environments/environment';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/shared/services/util.service';
import { UploadFileService } from 'src/app/shared/services/upload-file.service';
import { RegistroFirmasService } from 'src/app/core/firmas/services/registro-firmas.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionService } from '../../services/gestion.service';
import { UpdateDetailFileFirma, UpdateDetailFirma, UpdateDetailLibro, UpdateSolicitudIn } from '../../models/gestion.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Articulo, ArticuloOut, Lengua, LenguaOut, TipoArchivo, TipoArchivoOut } from 'src/app/masters/models/maestro.model';
import { MaestrosService } from 'src/app/masters/services/maestros.service';
import { List, UploadFileComponent } from 'src/app/shared/components/upload-file/upload-file.component';
import { GsDetalleFilesEditarComponent } from '../gs-detalle-files-editar/gs-detalle-files-editar.component';

@Component({
  selector: 'app-gs-editar',
  templateUrl: './gs-editar.component.html',
  styleUrls: ['./gs-editar.component.scss']
})
export class GsEditarComponent implements OnInit {

  constructor(public dialog: MatDialogRef<GsEditarComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: any,
              private uploadService: UploadFileService,
              private utilService: UtilService,
              public dialogOpen: MatDialog,
              public registroFirmasService: RegistroFirmasService,
              private gestionService: GestionService,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private maestroService: MaestrosService,
              ) { }

  environment: any;
  detalleSolicitud: any;
  tipoRegistro!: string;
  getFileOut!: GetFileOut;
  getFileData!: GetFileData;

  formDetFirma!: FormGroup;
  formDetLibro!: FormGroup;

  typesAllowed = ['pdf'];
  tipoArchivoOut!: TipoArchivoOut;
  tipoArchivoDetalleAlta!: TipoArchivo[];
  tipoArchivoDetalleActualizar!: TipoArchivo[];
  tipoArchivoSustento!: TipoArchivo[];
  arrayFilesSustento: List[] = [];

  listaReqDetalleFilesFirma: UpdateDetailFirma[] = [];

  lenguas: Lengua[] = [];
  lenguaOut!: LenguaOut;
  articulos: Articulo[] = [];
  articuloOut!: ArticuloOut;

  cantidades: number[] = [];

  @ViewChild('fileSustento') uploadFileTipoSolicitud!: UploadFileComponent;

  ngOnInit(): void {
    this.environment = environment;
    this.detalleSolicitud = this.dataDialog.detalle;
    this.tipoRegistro = this.dataDialog.tipo;
    this.initForm();
    this.listarTipoArchivo(this.environment.TIPO_ARCHIVO_FIRMA_SUSTENTO);

    this.listarLenguas();
    this.listarArticulos();

    for(let i = 1; i <= 10; ++i) {
      this.cantidades.push(i);
    }
  }

  cancel() {
    this.dialog.close();
  }

  initForm() {
    this.formDetFirma = this.formBuilder.group({
      arreglo: this.formBuilder.array([])
    });

    this.formDetLibro = this.formBuilder.group({
      arreglo: this.formBuilder.array([])
    });

    if(this.tipoRegistro === this.environment.TIPO_REGISTRO_LIBRO){
      const detalleArray = this.formDetLibro.get('arreglo') as FormArray;
      this.detalleSolicitud.detalleSolicitudLibro.forEach(
        (detalle: any) => {
          const grupo = this.formBuilder.group({
            idDetalleSolLibro: [detalle.idDetalleSolLibro],
            articulo: [detalle.articulo],
            codArticulo: [detalle.codArticulo.trim()],
            codLengua: [detalle.codLengua.trim()],
            lengua: [detalle.lengua],
            cantidad: [detalle.cantidad],
            numeroUltimaActa: [detalle.numeroUltimaActa.trim()],
          })
          detalleArray.push(grupo);
        }
      );
    }

    if (this.tipoRegistro === this.environment.TIPO_REGISTRO_FIRMA) {
      const detalleArray = this.formDetFirma.get('arreglo') as FormArray;
      this.detalleSolicitud.detalleSolicitudFirma.forEach(
        (detalle: any) => {
          const grupo = this.formBuilder.group({
            idDetalleSolicitud: [detalle.idDetalleSolicitud],
            idTiposol: [detalle.idTipoSolicitud],
            tipoSol: [detalle.idTipoSolicitud === environment.TIPO_SOLICITUD_ALTA.toString() ? "ALTA"
                : detalle.idTipoSolicitud === environment.TIPO_SOLICITUD_BAJA.toString() ? "BAJA" : "ACTUALIZAR"],
            dni: [detalle.numeroDocumento],
            nombre: [`${detalle.preNombres}  ${detalle.primerApellido} ${detalle.segundoApellido}`],
            celular: [detalle.celular],
            email: [detalle.email],
            formatos: [detalle.archivos]
          })
          detalleArray.push(grupo);
        }
      )
    }
    this.arrayFilesSustento = [
      {
        idFile: this.detalleSolicitud.archivoSustento.codigo,
        fileName: this.detalleSolicitud.archivoSustento.nombreOriginal,
        fileTypeId: this.detalleSolicitud.archivoSustento.idTipoArchivo,
        fileTypeDesc: this.detalleSolicitud.archivoSustento.tipoArchivo        
      }
    ]

  }

  getDetalleArchivo(idDetallesol: number): UpdateDetailFileFirma[] {
    if(this.listaReqDetalleFilesFirma.length === 0) {
      return [];
    } else {
        const detalleEncontrado = this.listaReqDetalleFilesFirma.find( x => x.idDetalleSolicitud === idDetallesol );

        if(detalleEncontrado) {
          return detalleEncontrado.detalleArchivo;
        } else {
          return [];
        }

    }
  }

  actualizarSolicitud() {

    if(this.arrayFilesSustento.length === 0) {
      this.utilService.getAlert('Aviso', 'Debe completar los datos requeridos como obligatorios (*)');
      return;
    }

    const modalActualizar = this.utilService.getConfirmation('Actualizar', `Ud. actualizará la solicitud, <br> ¿es conforme?.`);
    modalActualizar.afterClosed().subscribe(result => {
      if (result) {
        this.spinner.show();

        if(this.tipoRegistro === this.environment.TIPO_REGISTRO_FIRMA){
          let lista: UpdateDetailFirma[] = [];

          this.formDetFirma.get('arreglo')?.value.forEach(
            (fila: any) => {
              const detail: UpdateDetailFirma = {
                idDetalleSolicitud: fila.idDetalleSolicitud,
                celular: fila.celular,
                email: fila.email,
                detalleArchivo: this.getDetalleArchivo(fila.idDetalleSolicitud)
              }
              lista.push(detail);
            }      
          );
      
          const request: UpdateSolicitudIn = {
            idSolicitud: this.detalleSolicitud.idSolicitud,
            idTipoArchivoSustento: this.arrayFilesSustento[0].fileTypeId,
            idArchivoSustento: this.arrayFilesSustento[0].idFile,
            listaDetalleFirma: lista
          };
          this.gestionService.updateSolicitudFirma(request).subscribe(
            {
              next: () => {
                this.spinner.hide();
                this.utilService.getAlert(`Aviso:`, `La solicitud fue actualizada correctamente.`);
                this.cancel();
              },
              error: (error) => {
                this.spinner.hide();
                console.log('error = ', error);
              }
            }
          );
        }
    
        if (this.tipoRegistro === this.environment.TIPO_REGISTRO_LIBRO) {
          let listaLibros: UpdateDetailLibro[] = [];

          this.formDetLibro.get('arreglo')?.value.forEach(
            (fila: any) => {
              const detail: UpdateDetailLibro = {
                idDetalleSolLibro: fila.idDetalleSolLibro,
                cantidad: fila.cantidad,
                codigoArticulo: fila.codArticulo,
                codigoLengua: fila.codLengua,                
                numeroUltimaActa: fila.numeroUltimaActa
              }
              listaLibros.push(detail);
            }      
          );
      
          const requestLibro: UpdateSolicitudIn = {
            idSolicitud: this.detalleSolicitud.idSolicitud,
            idTipoArchivoSustento: this.arrayFilesSustento[0].fileTypeId,
            idArchivoSustento: this.arrayFilesSustento[0].idFile,
            listaDetalleLibro: listaLibros
          };
          this.gestionService.updateSolicitudLibro(requestLibro).subscribe(
            {
              next: () => {
                this.spinner.hide();
                this.utilService.getAlert(`Aviso:`, `La solicitud fue actualizada correctamente.`);
                this.cancel();
              },
              error: (error) => {
                this.spinner.hide();
                console.log('error = ', error);
              }
            }
          );
        }
        

      }
    });
    
  }

  get detalleFirmaArray(): FormArray {
    return this.formDetFirma.get('arreglo') as FormArray;
  }

  get detalleLibroArray(): FormArray {
    return this.formDetLibro.get('arreglo') as FormArray;
  }

  btnViewFiles(files: any[], idTipoSolicitud: string , idDetalleSolicitud: number): void {
    
    // const filesTemp: any[] = [... files];

    if (files.length <= 0) {
      this.utilService.getAlert('Aviso', 'No hay formatos asociados.');
      return;
    }

    const dialogRef = this.dialogOpen.open(GsDetalleFilesEditarComponent, {
      width: '850px',
      disableClose: true,
      data: {title: 'Formatos', files: files, idTipoSolicitud: idTipoSolicitud},
    });

    let listaFiles: UpdateDetailFileFirma[] = [];

    dialogRef.afterClosed().subscribe( (result:List[]) => {
      if(result.length > 0){
        files.forEach(ini => {
          const encontrados = result.find( fin => fin.idFile === ini.codigo );
          if(encontrados) {
            listaFiles.push({
              codigoNombre: ini.codigo,
              idDetalleSolicitud: idDetalleSolicitud,
              codigoTipoArchivo: ini.idTipoArchivo,
              operacion: 'X' //no hace nada
            });
          } else {
            listaFiles.push({
              codigoNombre: ini.codigo,
              idDetalleSolicitud: idDetalleSolicitud,
              codigoTipoArchivo: ini.idTipoArchivo,
              operacion: 'D' // elimninar
            });
          }
          
        });

        result.forEach( fin => {
          const encontrado = files.find( ini => ini.codigo === fin.idFile );          
          if(!encontrado) {
            listaFiles.push({
              codigoNombre: fin.idFile,
              idDetalleSolicitud: idDetalleSolicitud,
              codigoTipoArchivo: fin.fileTypeId,
              operacion: 'R' //registrar
            });
          }
        });

        this.listaReqDetalleFilesFirma.push(
          {
            celular: '',
            email: '',
            idDetalleSolicitud: idDetalleSolicitud,
            detalleArchivo: listaFiles
          }
        );

      }
    });

  }


  download(codigo: string, nombre: string) {
    this.uploadService.getFile(codigo).subscribe((data: GetFileOut) => {
      this.getFileOut = data;
    }, error => {
    }, () => {
      if (this.getFileOut.code !== this.environment.CODE_000) {
        this.utilService.getAlert('Aviso', this.getFileOut.message);
        return;
      }
      this.getFileData = this.getFileOut.data;
      this.genera(this.getFileData.archivo, nombre);
    });
  }

  genera(base64: string, name: string) {
    const linkSource = `data:application/pdf;base64, ${base64}`;
    const link = document.createElement('a');
    const fileName = name;

    link.href = linkSource;
    link.download = fileName;
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

    setTimeout(function () {
      window.URL.revokeObjectURL(linkSource);
      link.remove();
    }, 100);
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
    });
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
      this.lenguas = this.lenguaOut.data;
      this.lenguas.sort((a, b) => (a.codigo > b.codigo) ? 1 : -1);
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
      this.articulos = this.articuloOut.data;
    });
  }

}
