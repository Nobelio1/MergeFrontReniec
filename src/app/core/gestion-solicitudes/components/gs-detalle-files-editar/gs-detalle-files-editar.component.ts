import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoArchivo, TipoArchivoOut } from 'src/app/masters/models/maestro.model';
import { MaestrosService } from 'src/app/masters/services/maestros.service';
import { List } from 'src/app/shared/components/upload-file/upload-file.component';
import { GetFileData, GetFileOut } from 'src/app/shared/models/upload-file.model';
import { UploadFileService } from 'src/app/shared/services/upload-file.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gs-detalle-files-editar',
  templateUrl: './gs-detalle-files-editar.component.html',
  styleUrls: ['./gs-detalle-files-editar.component.scss']
})
export class GsDetalleFilesEditarComponent implements OnInit {

  environment: any;

  getFileOut!: GetFileOut;
  getFileData!: GetFileData;

  typesAllowed = ['pdf'];
  tipoArchivoOut!: TipoArchivoOut;
  arrayTipoArchivo: TipoArchivo[] = [];
  idTipoSolicitud: string = '';

  listaArchivosFormatos: List[] = [];


  constructor(public dialog: MatDialogRef<GsDetalleFilesEditarComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: any,
              private uploadService: UploadFileService,
              private utilService: UtilService,
              private maestroService: MaestrosService,
              ) { }

  ngOnInit(): void {
    this.environment = environment;
    this.idTipoSolicitud = this.dataDialog.idTipoSolicitud;
    this.listarTipoArchivo(this.idTipoSolicitud === this.environment.TIPO_SOLICITUD_ALTA ? 
      this.environment.TIPO_ARCHIVO_FIRMA_DETALLE_ALTA 
      : this.environment.TIPO_ARCHIVO_FIRMA_DETALLE_ACTUALIZAR);

    this.listaArchivosFormatos = this.dataDialog.files.map(
      (file: any) => {
        return {
          idFile: file.codigo,
          fileName: file.nombreOriginal,
          fileTypeId: file.idTipoArchivo,
          fileTypeDesc: file.tipoArchivo 
        }
      }
    );

  }

  showResponse(message: string) {
    this.utilService.getAlert('Aviso', message);
  }

  getFilesArray(arr: List[]): void {
    this.listaArchivosFormatos = arr;
  }

  aceptar() {
    if(this.listaArchivosFormatos.length === 0) {
      this.dialog.close(this.listaArchivosFormatos);
    } else {
      if(this.idTipoSolicitud === this.environment.TIPO_SOLICITUD_ALTA){
        const arrAltaRequired = ['03', '04'];
        const result = arrAltaRequired.filter(alta => !this.listaArchivosFormatos.some(file => file.fileTypeId === alta) );
        if (result.length > 0) {
          const missing = this.arrayTipoArchivo.filter((obj) => result.some((value) => value === obj.codigo));
          const list = missing.map(item => `<li>${item.descripcion}</li>`).join('');
          this.utilService.getAlert('Tipo solicitud: ALTA', `Debe añadir los siguientes documentos obligatorios: <ul class="mt-3">${list}</ul>`, 'left');
          return;
        }
      } else {
        const arrActualizarRequired = ['09', '10'];
        const result = arrActualizarRequired.filter(actualiza => !this.listaArchivosFormatos.some(file => file.fileTypeId === actualiza) );
        if (result.length > 0) {
          const missing = this.arrayTipoArchivo.filter((obj) => result.some((value) => value === obj.codigo));
          const list = missing.map(item => `<li>${item.descripcion}</li>`).join('');
          this.utilService.getAlert('Tipo solicitud: ALTA', `Debe añadir los siguientes documentos obligatorios: <ul class="mt-3">${list}</ul>`, 'left');
          return;
        }
      }
      this.dialog.close(this.listaArchivosFormatos);
    }    
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
          break;
        case this.environment.TIPO_ARCHIVO_FIRMA_DETALLE_ALTA:
          this.arrayTipoArchivo = this.tipoArchivoOut.data;
          break;
        case this.environment.TIPO_ARCHIVO_FIRMA_DETALLE_ACTUALIZAR:
          this.arrayTipoArchivo = this.tipoArchivoOut.data;
          break;
      }
    });
  }

  // @HostListener('window:keyup.esc') onKeyUp() {
  //   this.cancel();
  // }

}
