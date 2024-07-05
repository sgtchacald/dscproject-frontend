import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {LoginComponent} from "./login/login.component";
import {EsqueciASenhaComponent} from "./esqueci-a-senha/esqueci-a-senha.component";

const routes: Routes = [

  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  { path: 'login/esqueci-a-senha', component: LoginComponent, children:
      [
        { path: '', component: EsqueciASenhaComponent }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteRoutingModule { }
