import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {UtilService} from "../../../../shared/services/util.service";
import {NgxSpinnerService} from "ngx-spinner";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-step3-libro-generado',
  templateUrl: './step3-libro-generado.component.html',
  styleUrls: ['./step3-libro-generado.component.scss']
})
export class Step3LibroGeneradoComponent implements OnInit {

  environment: any;
  form!: FormGroup;

  @Input() step!: MatStepper;
  @Input() requestPaso2!: string;

  constructor(private formBuilder: FormBuilder,
              public utilService: UtilService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
    });
  }

}
