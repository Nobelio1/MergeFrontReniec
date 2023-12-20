import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { environment } from 'src/environments/environment';
import {UtilService} from "../../../shared/services/util.service";

@Component({
  selector: 'app-agencia',
  templateUrl: './agencia.component.html',
  styleUrls: ['./agencia.component.css']
})
export class AgenciaComponent implements OnInit {

  environment: any;
  form!: FormGroup;

  @Input() required: boolean = false;

  constructor(private formBuilder: FormBuilder,
              public utilService: UtilService) { }

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
      idAgencia: ['', this.required ? [Validators.required] : []],
    });
  }

}
