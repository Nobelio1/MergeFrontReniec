import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FileInput, FileValidator } from 'ngx-material-file-input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { requiredFileMinSize } from '../../helpers/requiredFileMinContentSize';
import { requiredFileType } from '../../helpers/requireFileTypeValidator';
import { DeleteOut, UploadOut } from '../../models/upload-file.model';
import { UploadFileService } from '../../services/upload-file.service';
import { UtilService } from '../../services/util.service';
import { environment } from '../../../../environments/environment';
import { TipoArchivo } from '../../../masters/models/maestro.model';

export interface List {
  idFile: string;
  fileName: string;
  fileTypeId: string;
  fileTypeDesc: string;
  file: File;
}

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit, OnChanges {
  @Input() addLabel!: string;
  @Input() minRequired: number = 0;
  @Input() maxPermitted: number = -1;

  @Input() textHelp!: string;
  @Input() textRequired!: string;
  @Input() textFilesAllowed!: string;
  @Input() textMaxFileSize!: string;
  @Input() textMinFileSize!: string;
  @Input() fileTypeAllowed!: string[];
  @Input() fileMinSize!: number; // bytes
  @Input() fileMaxSize!: number; // bytes
  @Input() textResponseMaxFileMessage!: string;

  @Input() requiredTipoArchivo: boolean = false;
  @Input() arrayTipoArchivo!: TipoArchivo[] | [];

  @Input() disabledAll: boolean = false;

  @Output() doRefreshData: EventEmitter<List[]> = new EventEmitter();
  @Output() doResponseMaxAllowed: EventEmitter<string> = new EventEmitter();

  form!: FormGroup;
  data: List[] = [];
  loading = false;

  readonly maxSize = this.fileMaxSize ? this.fileMaxSize : 1050000;
  readonly minSize = this.fileMinSize ? this.fileMinSize : 1024;

  inputDisable: boolean = true;

  lastAttachUplaoding!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private storageService: UploadFileService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      idTipoArchivo: [
        { value: '', disabled: this.disabledAll },
        [Validators.required],
      ],
      file: [
        { value: '', disabled: this.disabledAll },
        [
          FileValidator.maxContentSize(this.maxSize),
          requiredFileMinSize(this.minSize),
          requiredFileType(this.fileTypeAllowed),
        ],
      ],
    });
    if (this.data.length < this.minRequired) {
      if (this.requiredTipoArchivo) {
        this.form.controls['idTipoArchivo'].setValidators([
          Validators.required,
        ]);
      }
      this.form.controls['file'].setValidators([Validators.required]);
    }
    this.setActivateValidation();
    this.lastAttachUplaoding = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form) {
      this.setDisabledInputs();
    }
  }

  setDisabledInputs(): void {
    if (this.disabledAll) {
      this.form.controls['idTipoArchivo'].disable();
      this.form.controls['file'].disable();
    } else {
      this.form.controls['idTipoArchivo'].enable();
      this.form.controls['file'].enable();
    }
  }

  setActivateValidation() {
    if (this.data.length < this.minRequired) {
      this.setValidatorRequired();
    } else {
      this.cleanValidatorRequired();
    }
    this.setValidatorFile();
  }

  setValidatorRequired() {
    if (this.requiredTipoArchivo) {
      this.form.controls['idTipoArchivo'].setValidators([Validators.required]);
      this.form.controls['idTipoArchivo'].setErrors({ required: true });
    }
    this.form.controls['file'].setValidators([Validators.required]);
    this.form.controls['file'].setErrors({ required: true });
    this.form.markAllAsTouched();
  }

  cleanValidatorRequired() {
    if (this.requiredTipoArchivo) {
      this.form.controls['idTipoArchivo'].setValidators(null);
      this.form.controls['idTipoArchivo'].setErrors(null);
    }
    this.form.controls['file'].setValidators(null);
    this.form.controls['file'].setErrors(null);
  }

  setValidatorFile() {
    if (this.requiredTipoArchivo) {
      this.form.controls['idTipoArchivo'].setValidators([]);
    }
    this.form.controls['file'].setValidators([
      FileValidator.maxContentSize(this.maxSize),
      requiredFileMinSize(this.minSize),
      requiredFileType(this.fileTypeAllowed),
    ]);
    this.form.markAllAsTouched();
  }

  resetFile(event: any) {
    event.target.value = null;
  }

  attach(file: FileInput) {
    //VALIDANDO CANTIDAD DE TIPO ARCHIVO
    let uniqueValues = new Set();
    let todosSonUnicos = true;
    this.data.forEach((item) => {
      if (uniqueValues.has(item.fileTypeId)) {
        todosSonUnicos = false;
      } else {
        uniqueValues.add(item.fileTypeId);
      }
      if (uniqueValues.has(this.form.controls['idTipoArchivo'].value)) {
        todosSonUnicos = false;
      } else {
        uniqueValues.add(item.fileTypeId);
      }
    });
    if (!todosSonUnicos) {
      this.emitResponseDifferenteTypeFile();
      return;
    }
    //Fin

    if (
      this.requiredTipoArchivo &&
      !this.form.controls['idTipoArchivo'].value
    ) {
      this.form.controls['file'].reset();
      this.setActivateValidation();
      this.utilService.getAlert(
        'Aviso',
        'Debe seleccionar un tipo de archivo.'
      );
      return;
    }

    //todo: modificar para que reciba una lista

    this.lastAttachUplaoding = false;
    if (this.form.controls['file'].valid) {
      if (this.data.length < this.maxPermitted) {
        this.lastAttachUplaoding = true;
        if (file) {
          let item: List;
          this.loading = true;
          const fileFormData = new FormData();
          fileFormData.append('file', file.files[0]);
          this.storageService.upload(fileFormData).subscribe(
            (data: UploadOut) => {
              const fileTypeSelected =
                this.form.controls['idTipoArchivo'].value;
              item = {
                idFile: data.data,
                fileName: file.files[0].name,
                fileTypeId: this.requiredTipoArchivo ? fileTypeSelected : '',
                fileTypeDesc: this.requiredTipoArchivo
                  ? this.arrayTipoArchivo.filter(
                      (x) => x.codigo === fileTypeSelected
                    )[0].descripcion
                  : '',
                file: file.files[0],
              };
              this.postUploadSuccess(item);
            },
            (error) => {
              this.postUploadError();
              this.loading = false;
            },
            () => {
              this.loading = false;
            }
          );
          this.form.controls['file'].reset();
          // this.form.controls['idTipoArchivo'].reset();
          this.setActivateValidation();
        }
      } else {
        this.emitResponseMaxAllowed();
      }
    }
  }

  delete(file: List) {
    const modalChangePassword = this.utilService.getConfirmation(
      'Eliminar',
      '¿Desea eliminar el archivo?'
    );
    modalChangePassword.afterClosed().subscribe((result) => {
      if (result) {
        let deleteResponse: DeleteOut;
        this.storageService.delete(file.idFile).subscribe(
          (data: DeleteOut) => {
            deleteResponse = data;
          },
          (error) => {},
          () => {
            if (deleteResponse.code !== environment.CODE_000) {
              this.utilService.getAlert('Aviso', deleteResponse.message);
              return;
            }
            this.data.splice(this.data.indexOf(file, 0), 1);
            this.setActivateValidation();
            this.emitRefreshData();
          }
        );
      }
    });
  }

  downloadFile(index: number, item: List) {
    this.genera(item.file, item.fileName);
  }

  genera(blob: Blob, name: string) {
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    const newBlob = new Blob([blob], { type: 'application/octet-stream' });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //   window.navigator.msSaveOrOpenBlob(newBlob);
    //   return;
    // }

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);

    const link = document.createElement('a');
    link.href = data;
    link.download = `${name}`;
    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
    );

    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }

  private postUploadSuccess(item: List) {
    this.data.push(item);
    // if (this.data.length < this.maxPermitted) {
    //   this.form.controls['file'].enable();
    //   this.form.controls['idTipoArchivo'].enable();
    // }
    this.form.controls['file'].enable();
    this.form.controls['idTipoArchivo'].enable();
    this.emitRefreshData();
  }

  private postUploadError() {
    if (this.data.length > 0) {
      let indexItem = this.data.length - 1;
      this.data.splice(indexItem, 1);
      this.setActivateValidation();
      this.emitRefreshData();
    }
  }

  private refresh() {
    if (this.data.length >= this.maxPermitted) {
      this.inputDisable = false;
      this.form.controls['file'].disable();
    } else {
      this.inputDisable = true;
      this.form.controls['file'].enable();
    }
  }

  emitResponseMaxAllowed() {
    this.doResponseMaxAllowed.emit(
      `${
        this.textResponseMaxFileMessage
          ? this.textResponseMaxFileMessage
          : 'Máximo de archivos permitidos: '
      } ${this.maxPermitted}`
    );
    this.form.controls['file'].reset();
  }

  emitResponseDifferenteTypeFile() {
    this.doResponseMaxAllowed.emit(
      `${
        this.textResponseMaxFileMessage
          ? this.textResponseMaxFileMessage
          : 'Solo se permite un archivo por cada Tipo de Archivo'
      }`
    );
    this.form.controls['file'].reset();
  }

  emitRefreshData() {
    // const array = this.data.map(value => value.idFile);
    const array = this.data;
    this.doRefreshData.emit(array);
  }

  valid(): boolean {
    let valor = true;

    const count = this.data.length;
    if (count < this.minRequired || count > this.maxPermitted) {
      valor = false;
    }
    return valor;
  }

  reset(): void {
    this.data = [];
    this.refresh();
  }
}
