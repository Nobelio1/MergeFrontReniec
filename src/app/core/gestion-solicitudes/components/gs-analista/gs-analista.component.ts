import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-gs-analista',
  templateUrl: './gs-analista.component.html',
  styleUrls: ['./gs-analista.component.scss']
})
export class GsAnalistaComponent implements OnInit {

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              public dialog: MatDialogRef<GsAnalistaComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: any) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
    });
  }

  setAnalista(id: any) {
    this.form.controls['id'].setValue(id);
  }

  confirm() {
    this.dialog.close({sw: true, id: this.form.controls['id'].value});
  }

  cancel() {
    this.dialog.close({sw: false, id: 0});
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.cancel();
  }

}
