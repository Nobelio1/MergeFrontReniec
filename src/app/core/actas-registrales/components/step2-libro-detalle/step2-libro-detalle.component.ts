import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DetalleSolicitud} from "../../../firmas/models/firmas.model";
import {UtilService} from "../../../../shared/services/util.service";
import { environment } from 'src/environments/environment';
import {TipoSolicitud} from "../../../firmas/models/tipo-solicitud.model";
import {Articulo, Lengua} from "../../../../masters/models/maestro.model";
import {DetalleSolicitudLibro} from "../../models/libro.model";
import {DetalleSolicitudLibroRegistro} from "../../../gestion-solicitudes/models/atencion.model";

@Component({
  selector: 'app-step2-libro-detalle',
  templateUrl: './step2-libro-detalle.component.html',
  styleUrls: ['./step2-libro-detalle.component.scss']
})
export class Step2LibroDetalleComponent implements OnInit {

  environment: any;
  form!: FormGroup;

  detalleSolicitudLibro!: DetalleSolicitudLibro;
  detalleSolicitudLibroRegistro!: DetalleSolicitudLibroRegistro;

  disabledAll: boolean = false;

  cantidad!: number[];

  @Input() index: number | undefined;
  @Input() arrayLenguas!: Lengua[] | [];
  @Input() arrayArticulos!: Articulo[] | [];
  @Input() setDetalle!: DetalleSolicitudLibroRegistro;

  constructor(private formBuilder: FormBuilder,
              public utilService: UtilService) {
    this.cantidad = [];
    for(let i = 1; i <= 10; ++i) {
      this.cantidad.push(i);
    }
  }

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
      index: [this.index],
      cantidad: ['', [Validators.required]],
      codigoLengua: ['', [Validators.required]],
      codigoArticulo: ['', [Validators.required]],
      numeroUltimaActa: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15), Validators.pattern('^[0-9]*$')]],
    });

    if (this.setDetalle) {
      this.form.patchValue(this.setDetalle);
      this.form.controls['codigoLengua'].setValue(this.setDetalle.codigoLengua.trim());
    }
  }

  setValidatorRequired() {
    this.form.markAllAsTouched();
  }

  showResponse(message: string) {
    this.utilService.getAlert('Aviso', message);
  }

  setDetalleSolicitud(): DetalleSolicitudLibro {
    this.detalleSolicitudLibro = new DetalleSolicitudLibro();
    this.detalleSolicitudLibro.cantidad = this.form.controls['cantidad'].value;
    this.detalleSolicitudLibro.codigoLengua = this.form.controls['codigoLengua'].value;
    this.detalleSolicitudLibro.codigoArticulo = this.form.controls['codigoArticulo'].value;
    this.detalleSolicitudLibro.numeroUltimaActa = this.form.controls['numeroUltimaActa'].value;

    // EMMIT
    return this.detalleSolicitudLibro;
  }

  setDetalleSolicitudAtencion(): DetalleSolicitudLibroRegistro {
    this.detalleSolicitudLibroRegistro = new DetalleSolicitudLibroRegistro();
    this.detalleSolicitudLibroRegistro.cantidad = this.form.controls['cantidad'].value;
    this.detalleSolicitudLibroRegistro.codigoLengua = this.form.controls['codigoLengua'].value;
    this.detalleSolicitudLibroRegistro.codigoArticulo = this.form.controls['codigoArticulo'].value;
    this.detalleSolicitudLibroRegistro.numeroUltimaActa = this.form.controls['numeroUltimaActa'].value;
    this.detalleSolicitudLibroRegistro.idDetalleSolLibro = this.setDetalle ? this.setDetalle.idDetalleSolLibro : 0;
    // this.detalleSolicitudLibroRegistro.codigoEstadoAtencion = '2';

    // EMMIT
    return this.detalleSolicitudLibroRegistro;
  }

}
