import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilService } from '../../../shared/services/util.service';
import { AuthService } from '../../services/auth.service';
import { AuthIn, AuthOut } from '../../models/auth.model';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { SeguridadService } from '../../../shared/services/seguridad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  environment: any;

  form!: FormGroup;

  authOut!: AuthOut;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    public utilService: UtilService,
    private authService: AuthService,
    private seguridadService: SeguridadService
  ) {}

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.form.invalid) {
      this.utilService.getAlert(
        'Aviso',
        'Debe completar los datos requeridos como obligatorios (*)'
      );
      return;
    }
    let authIn: AuthIn;
    authIn = this.form.getRawValue();
    this.spinner.show();
    this.authService.login(authIn).subscribe(
      (data: AuthOut) => {
        this.spinner.hide();
        this.authOut = data;
      },
      (error) => {
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
        if (this.authOut.code === this.environment.CODE_000) {
          this.seguridadService.setToken(
            this.environment.VAR_TOKEN,
            this.authOut.data
          );
          this.utilService.link(environment.URL_MOD_GESTION_SOLICITUDES);
        } else {
          this.utilService.getAlert(`Aviso:`, this.authOut.message);
        }
      }
    );
  }

  changePassword() {
    const modalChangePassword = this.dialog.open(ChangePasswordComponent, {
      width: '450px',
      data: { title: 'Cambiar Contraseña' },
      disableClose: true,
      autoFocus: false,
    });
    modalChangePassword.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  fnFirstTime(): void {
    this.utilService.getAlert(
      'Aviso',
      'El usuario es el DNI y la contraseña el DNI y luego debe cambiar la contraseña por una nueva de uso personal y no debe compartir por seguridad de la información.'
    );
  }
}
