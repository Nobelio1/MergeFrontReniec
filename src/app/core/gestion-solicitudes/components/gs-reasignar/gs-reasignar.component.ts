//Todo: Componente nuevo
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-gs-reasignar',
  templateUrl: './gs-reasignar.component.html',
  styleUrls: ['./gs-reasignar.component.scss'],
})
export class GsReasignarComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialogRef<GsReasignarComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: any
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
    });
  }

  setAnalista(id: any) {
    this.form.controls['id'].setValue(id);
  }

  confirm() {
    this.dialog.close({ sw: true, id: this.form.controls['id'].value });
  }

  cancel() {
    this.dialog.close({ sw: false, id: 0 });
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.cancel();
  }
}
