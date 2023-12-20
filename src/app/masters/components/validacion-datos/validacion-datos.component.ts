import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { UtilService } from '../../../shared/services/util.service';
import { SeguridadService } from '../../../shared/services/seguridad.service';
import { SeguimientoBusquedaComponent } from '../../../core/seguimiento/components/seguimiento-busqueda/seguimiento-busqueda.component';

@Component({
  selector: 'app-validacion-datos',
  templateUrl: './validacion-datos.component.html',
  styleUrls: ['./validacion-datos.component.scss'],
})
export class ValidacionDatosComponent implements OnInit {
  environment: any;

  form!: FormGroup;
  rangoFechaActivo: boolean = true;

  dateNow = new Date();
  fechaActual = new Date();

  @Input() paraSeguimiento: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public utilService: UtilService,
    private seguridadService: SeguridadService
  ) {
    // MAXIMO UN MES ATRAS
    this.fechaActual.setMonth(this.fechaActual.getMonth() - 1);
    this.form = this.formBuilder.group({
      fechaInicio: [null, Validators.required],
      fechaFin: [null, Validators.required],
    });
    this.form.controls['fechaInicio'].setValidators([
      Validators.required,
      this.fechaMaxValidator.bind(this),
    ]);
    // CAMBIA EL VALOR DE DISABLE
    this.form.get('numeroSolicitud')?.valueChanges.subscribe(() => {
      this.actualizarEstadoRangoFecha();
    });
  }
  // ESCUCHA QUE INGRESA DATOS
  actualizarEstadoRangoFecha() {
    this.rangoFechaActivo = !this.form.get('numeroSolicitud')?.value;
  }
  fechaMaxValidator(control: any) {
    return control.value &&
      new Date(control.value).getTime() > this.fechaActual.getTime()
      ? { maxDate: true }
      : null;
  }

  ngOnInit(): void {
    this.environment = environment;

    this.seguridadService.clearLocalStorage();

    this.form = this.formBuilder.group({
      nroDni: ['', [Validators.required]],
      digito: ['', [Validators.required]],
      fechaEmision: ['', [Validators.required]],
      numeroSolicitud: [
        '',
        this.paraSeguimiento
          ? [
              Validators.required,
              Validators.minLength(12),
              Validators.maxLength(12),
              Validators.pattern('^[0-9]*$'),
            ]
          : [],
      ],
      fechaInicio: [''],
      fechaFin: [''],
    });
  }

  clearDate(formControl: string[]) {
    formControl.forEach((item) => {
      this.form.controls[item].setValue('');
    });
  }
}
