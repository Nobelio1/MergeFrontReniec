import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recaptcha',
  templateUrl: './recaptcha.component.html',
  styleUrls: ['./recaptcha.component.scss']
})
export class RecaptchaComponent implements OnInit {

  constructor() { }

  @Output('resolveEvent') resolveEvent = new EventEmitter<boolean>();
  siteKey = environment.SITE_KEY_RECAPTCHA;

  ngOnInit(): void {
  }

  resolved(captchaResponse: string) {
    this.resolveEvent.emit(true);
  }

}
