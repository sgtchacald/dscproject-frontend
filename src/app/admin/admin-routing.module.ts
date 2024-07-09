import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AuthGuard} from "../../guards/auth-guard";
import { InstituicoesFinanceirasComponent } from "./financeiro/instituicoes-financeiras/instituicoes-financeiras.component";

const routes: Routes = [

  { path: '', component: DashboardComponent },

  { path: 'admin', component: DashboardComponent, canActivate: [AuthGuard]},

  { path: 'financeiro/instituicao-financeira', component: InstituicoesFinanceirasComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
