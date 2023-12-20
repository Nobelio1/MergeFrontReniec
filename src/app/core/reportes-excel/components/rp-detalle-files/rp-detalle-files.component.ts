import { Component, HostListener, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  GetFileData,
  GetFileOut,
} from '../../../../shared/models/upload-file.model';
import { UtilService } from '../../../../shared/services/util.service';
import { UploadFileService } from '../../../../shared/services/upload-file.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rp-detalle-files',
  templateUrl: './rp-detalle-files.component.html',
  styleUrls: ['./rp-detalle-files.component.scss'],
})
export class RpDetalleFilesComponent implements OnInit {
  environment: any;
  getFileOut!: GetFileOut;
  getFileData!: GetFileData;

  constructor(
    public dialog: MatDialogRef<RpDetalleFilesComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private uploadService: UploadFileService,
    private utilService: UtilService,
    public dialogOpen: MatDialog // cambio
  ) {}

  ngOnInit(): void {
    this.environment = environment;
  }

  cancel() {
    this.dialog.close();
  }

  //cambio -
  btnViewFiles(files: any[]): void {
    if (files.length <= 0) {
      this.utilService.getAlert('Aviso', 'No hay formatos asociados.');
      return;
    }
    this.getDetalleFiles('Formatos', files);
  }

  getDetalleFiles(title: string, files: any[]) {
    return this.dialogOpen.open(RpDetalleFilesComponent, {
      width: '850px',
      data: { title: title, files: files },
    });
  }
  //-cambio

  download(codigo: string, nombre: string) {
    this.uploadService.getFile(codigo).subscribe(
      (data: GetFileOut) => {
        this.getFileOut = data;
      },
      (error) => {},
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

  @HostListener('window:keyup.esc') onKeyUp() {
    this.cancel();
  }
}
