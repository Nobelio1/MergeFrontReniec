import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { environment } from 'src/environments/environment';
import {UtilService} from "../../../shared/services/util.service";
import {SeguridadService} from "../../../shared/services/seguridad.service";
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-validacion-datos',
  templateUrl: './validacion-datos.component.html',
  styleUrls: ['./validacion-datos.component.scss']
})
export class ValidacionDatosComponent implements OnInit {

  environment: any;

  form!: FormGroup;

  dateNow = new Date();

  rangeMax: number = 30;
  rangeMaxMessage: string = `El rango máximo es de ${this.rangeMax} días.`;

  @Input() paraSeguimiento: boolean = false;

  disabledRange: boolean = false;

  constructor(private formBuilder: FormBuilder,
              public utilService: UtilService,
              private seguridadService: SeguridadService,
              private dateAdapter: DateAdapter<Date>,
              ) { }

  ngOnInit(): void {
    this.environment = environment;

    // this.seguridadService.clearLocalStorage();

    this.form = this.formBuilder.group({
      nroDni: ['', [Validators.required]],
      digito: ['', this.isExternal ? [Validators.required] : []],
      fechaEmision: ['', this.isExternal ? [Validators.required] : []],
      numeroSolicitud: ['', this.paraSeguimiento ? [Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[0-9]*$')] : []],
      dateRange: this.formBuilder.group({
        start: ['', []],
        end: ['', []]
      })
    });

    this.form.get('numeroSolicitud')?.valueChanges.subscribe(
      (numeroSolicitud) => {
        if(numeroSolicitud) {
          this.disabledRange = true;
          this.form.get('dateRange')?.get('start')?.setValue('');
          this.form.get('dateRange')?.get('end')?.setValue('');
        } else {
          this.disabledRange = false;
        }
      }
    );

  }

  changeDateRange() {
    const start = this.form.get('dateRange')?.get('start')?.value;
    const end = this.form.get('dateRange')?.get('end')?.value;

    if(start && end) {
      const startMoreMax = this.dateAdapter.addCalendarDays(start, this.rangeMax);
      if(startMoreMax < end) {
        this.form.get('dateRange')?.get('end')?.setErrors({maxRange : true});
      }    
    }
  }

  clearRangeDate() {
    this.form.get('dateRange')?.get('start')?.setValue('');
    this.form.get('dateRange')?.get('end')?.setValue('');
  }

  get isExternal(): boolean {
    return !this.seguridadService.getUserInternal();
  }

}
