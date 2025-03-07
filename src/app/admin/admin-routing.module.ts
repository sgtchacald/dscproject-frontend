import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AuthGuard} from "../../guards/auth-guard";
import { InstituicoesFinanceirasComponent } from "./financeiro/instituicoes-financeiras/instituicoes-financeiras.component";
import {
  InstituicoesFinanceirasUsuarioComponent
} from "./financeiro/instituicoes-financeiras-usuario/instituicoes-financeiras-usuario.component";
import {DespesasComponent} from "./financeiro/despesas/despesas.component";
import {ModalSelecaoUsuarioComponent} from "./modais-genericas/modal-selecao-usuario/modal-selecao-usuario.component";
import {ReceitasComponent} from "./financeiro/receitas/receitas.component";

const routes: Routes = [

  { title: 'dashboard', path: '', component: DashboardComponent, canActivate: [AuthGuard] },

  {  title: 'dashboard', path: 'admin', component: DashboardComponent, canActivate: [AuthGuard]},

  {  title: 'instituicaoFinanceira', path: 'financeiro/instituicao-financeira', component: InstituicoesFinanceirasComponent, canActivate: [AuthGuard]},

  { title: 'instituicaoFinanceiraUsuario', path: 'financeiro/instituicao-financeira-usuario', component: InstituicoesFinanceirasUsuarioComponent, canActivate: [AuthGuard]},

  { title: 'despesa', path: 'financeiro/despesa', component: DespesasComponent, canActivate: [AuthGuard]},

  { title: 'receita', path: 'financeiro/receita', component: ReceitasComponent, canActivate: [AuthGuard]},

  { title: 'modalSelecaoUsuario', path: 'modais-genericas/modal-selecao-usuario', component: ModalSelecaoUsuarioComponent, canActivate: [AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
