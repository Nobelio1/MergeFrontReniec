import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from '../../../shared/services/util.service';
import { environment } from 'src/environments/environment';
import { Options } from '../../models/option.model';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  environment: any;
  form!: FormGroup;

  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() options: Options[] = [];
  @Input() select: string = '';
  @Input() optionSelect: boolean = true;
  @Input() todosEstados: boolean = false;

  @Output() selected: EventEmitter<string> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    public utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.environment = environment;

    this.form = this.formBuilder.group({
      id: [
        this.select ? this.select : '',
        this.required ? [Validators.required] : [],
      ],
    });
  }

  emit(value: any) {
    this.selected.emit(value ? value : '');
  }
}
