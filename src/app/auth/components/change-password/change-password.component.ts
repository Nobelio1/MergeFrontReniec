import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { environment } from 'src/environments/environment';
import {NgxSpinnerService} from "ngx-spinner";
import {UtilService} from "../../../shared/services/util.service";
import {AuthService} from "../../services/auth.service";
import {ChangePassIn, ChangePassOut} from "../../models/change-password.model";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  environment: any;

  form!: FormGroup;

  changePassIn!: ChangePassIn;
  changePassOut!: ChangePassOut;

  constructor(public dialog: MatDialogRef<ChangePasswordComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: any,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private authService: AuthService,
              public utilService: UtilService,) { }

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      claveAnterior: ['', [Validators.required]],
      claveNueva: ['', [Validators.required]],
      confirmaClaveNueva: ['', [Validators.required]],
    });
  }

  confirm() {
    if (this.form.invalid) {
      this.utilService.getAlert('Aviso', 'Debe completar los datos requeridos como obligatorios (*)');
      return;
    }

    if (this.form.controls['claveNueva'].value !== this.form.controls['confirmaClaveNueva'].value) {
      this.utilService.getAlert('Aviso', 'La contraseña nueva no coincide.');
      return;
    }

    const modalCambioClave = this.utilService.getConfirmation('Cambio de Clave', '¿Está seguro de cambiar su clave?');
    modalCambioClave.afterClosed().subscribe(result => {
      if (result) {
        this.changePassIn = new ChangePassIn();
        this.changePassIn = this.form.getRawValue();
        this.spinner.show();
        this.authService.changePass(this.changePassIn).subscribe((data: ChangePassOut) => {
          this.spinner.hide();
          this.changePassOut = data;
        }, error => {
          this.spinner.hide();
        }, () => {
          this.spinner.hide();
          if (this.changePassOut.code === this.environment.CODE_999) {
            const modalExito = this.utilService.getAlert(`Aviso`, this.changePassOut.message);
            modalExito.afterClosed().subscribe(response => {
              if (response) {
                this.dialog.close(true);
              }
            });
            return;
          }
          if (this.changePassOut.code !== this.environment.CODE_000) {
            this.utilService.getAlert(`Aviso:`, this.changePassOut.message);
            return;
          }
        });
      }
    });
  }

  cancel() {
    this.dialog.close(false);
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.cancel();
  }

}
