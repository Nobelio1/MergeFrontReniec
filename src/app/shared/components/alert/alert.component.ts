import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor(public dialog: MatDialogRef<AlertComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: any) { }

  ngOnInit(): void {
  }

  confirm() {
    this.dialog.close(true);
  }

}
