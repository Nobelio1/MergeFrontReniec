import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GetFileData, GetFileOut} from "../../../../shared/models/upload-file.model";
import {UtilService} from "../../../../shared/services/util.service";
import {UploadFileService} from "../../../../shared/services/upload-file.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gs-detalle-files',
  templateUrl: './gs-detalle-files.component.html',
  styleUrls: ['./gs-detalle-files.component.scss']
})
export class GsDetalleFilesComponent implements OnInit {

  environment: any;

  getFileOut!: GetFileOut;
  getFileData!: GetFileData;

  constructor(public dialog: MatDialogRef<GsDetalleFilesComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: any,
              private uploadService: UploadFileService,
              private utilService: UtilService) { }

  ngOnInit(): void {
    this.environment = environment;
  }

  cancel() {
    this.dialog.close();
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

  @HostListener('window:keyup.esc') onKeyUp() {
    this.cancel();
  }

}
