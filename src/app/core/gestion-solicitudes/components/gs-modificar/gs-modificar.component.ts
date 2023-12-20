import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  GetFileData,
  GetFileOut,
} from 'src/app/shared/models/upload-file.model';
import { UploadFileService } from 'src/app/shared/services/upload-file.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gs-modificar',
  templateUrl: './gs-modificar.component.html',
  styleUrls: ['./gs-modificar.component.scss'],
})
export class GsModificarComponent implements OnInit {
  environment: any;

  getFileOut!: GetFileOut;
  getFileData!: GetFileData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    public dialog: MatDialogRef<GsModificarComponent>,
    private utilService: UtilService,
    private uploadService: UploadFileService
  ) {}

  ngOnInit(): void {
    this.environment = environment;
  }

  cancel() {
    this.dialog.close();
  }

  download(codigo: string, nombre: string) {
    this.uploadService.getFile(codigo).subscribe(
      (data: GetFileOut) => {
        this.getFileOut = data;
      },
      (error: any) => {},
      () => {
        if (this.getFileOut.code !== this.environment.CODE_000) {
          this.utilService.getAlert('Aviso', this.getFileOut.message);
          return;
        }
        this.getFileData = this.getFileOut.data;
        this.genera(this.getFileData.archivo, nombre);
      }
    );
  }

  genera(base64: string, name: string) {
    const linkSource = `data:application/pdf;base64, ${base64}`;
    const link = document.createElement('a');
    const fileName = name;

    link.href = linkSource;
    link.download = fileName;
    link.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
    );

    setTimeout(function () {
      window.URL.revokeObjectURL(linkSource);
      link.remove();
    }, 100);
  }

  //TODO: IMPLEMENTAR FUNCION PARA ELIMINAR ARCHIVO ADJUNT0
  //todo: crear servicio para eliminar sustento -> se manda codigo del archivo
}
