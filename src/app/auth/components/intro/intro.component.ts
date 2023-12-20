import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {UtilService} from "../../../shared/services/util.service";

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

  environment: any;

  constructor(private utilService: UtilService) { }

  ngOnInit(): void {
    this.environment = environment;

    this.utilService.removeLocalStorage(this.environment.VAR_TOKEN_EXTERNAL);
    this.utilService.removeLocalStorage(this.environment.VAR_USER);
  }

}
