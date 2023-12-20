import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AlertComponent} from '../components/alert/alert.component';
import {ConfirmationComponent} from '../components/confirmation/confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private route: Router,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar) { }

  link(url: string, param?: string) {
    if (param) {
      this.route.navigate([url, param]);
    } else {
      this.route.navigate([url]);
    }
  }

  getFlash(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 3000});
  }

  getAlert(title: string, message: string, messageAlign?: string, redirect?: string) {
    return this.dialog.open(AlertComponent, {
      width: '450px',
      data: {title: title, message: message, messageAlign: messageAlign, redirect: redirect},
      disableClose: true,
      autoFocus: false,
    });
  }

  getConfirmation(title: string, message: string, messageAlign?: string, redirect?: string) {
    return this.dialog.open(ConfirmationComponent, {
      width: '450px',
      data: {title: title, message: message, messageAlign: messageAlign, redirect: redirect},
    });
  }

  public getErrorMessage(formName: FormGroup, formControl: any, min?: number, max?: number, onlyNumber?: boolean, mail?: boolean): string {
    let message = '';
    if (formName.get(formControl)?.hasError('required')) {
      message = 'Este campo es requerido';
    }

    if (formName.get(formControl)?.hasError('minlength')) {
      message = `Mínimo ${min} caracteres`;
    }

    if (formName.get(formControl)?.hasError('maxlength')) {
      message = `Máximo ${max} caracteres`;
    }

    if (formName.get(formControl)?.hasError('min')) {
      message = `Mínimo ${min}`;
    }

    if (formName.get(formControl)?.hasError('max')) {
      message = `Máximo ${max}`;
    }

    if (formName.get(formControl)?.hasError('pattern') && onlyNumber) {
      message = 'Sólo se aceptan números';
    }

    if (formName.get(formControl)?.hasError('pattern') && !onlyNumber) {
      message = 'Se aceptan letras y números sin espacios en blanco';
    }

    if (formName.get(formControl)?.hasError('pattern') && mail) {
      message = 'Debe ingresar un correo electrónico válido';
    }

    return message;
  }

  setLocalStorage(item: any, value: any): void {
    localStorage.setItem(item, value);
  }

  getLocalStorage(item: any): any {
    return localStorage.getItem(item);
  }

  removeLocalStorage(item: any): void {
    localStorage.removeItem(item);
  }

  validateJson(json: any) {
    try {
      JSON.parse(json);
    } catch (e) {
      return null;
    }
    return json;
  }
}
