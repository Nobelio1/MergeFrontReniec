import { Component, Inject,NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-validacion-reg-civil-modal',
  templateUrl: './validacion-reg-civil-modal.component.html',
  styleUrls: ['./validacion-reg-civil-modal.component.scss']
})


export class ValidacionRegCivilModalComponent {
public apellidoPaterno: string = '';
  constructor(
    public dialogRef: MatDialogRef<ValidacionRegCivilModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  verificar(): void {
      this.dialogRef.close(this.apellidoPaterno);
    }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

}
