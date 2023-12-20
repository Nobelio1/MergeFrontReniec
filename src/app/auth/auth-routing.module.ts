import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {IntroComponent} from "./components/intro/intro.component";
import {OptionsComponent} from "./components/options/options.component";

const routes: Routes = [
  {
    path: '',
    component: IntroComponent,
    children: [
      {
        path: '',
        redirectTo: 'intro',
        pathMatch: 'full'
      },
      {
        path: 'intro',
        component: OptionsComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
