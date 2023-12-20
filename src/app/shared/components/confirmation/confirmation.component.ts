import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(public dialog: MatDialogRef<ConfirmationComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: any) { }

  ngOnInit() {
  }

  confirm() {
    this.dialog.close(true);
  }

  cancel() {
    this.dialog.close(false);
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.cancel();
  }

}
