import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AuthGuard} from "../../guards/auth-guard";
import { InstituicoesFinanceirasComponent } from "./financeiro/instituicoes-financeiras/instituicoes-financeiras.component";
import {
  InstituicoesFinanceirasUsuarioComponent
} from "./financeiro/instituicoes-financeiras-usuario/instituicoes-financeiras-usuario.component";
import {DespesasComponent} from "./financeiro/despesas/despesas.component";
import {ModalSelecaoUsuarioComponent} from "./component-util/modais-genericas/modal-selecao-usuario/modal-selecao-usuario.component";
import {ReceitasComponent} from "./financeiro/receitas/receitas.component";
import {DespesasImportarComponent} from "./financeiro/despesas-importar/despesas-importar.component";
import {
  TransacaoBanariaImportarComponent
} from "./financeiro/transacao-banaria-importar/transacao-banaria-importar.component";

const routes: Routes = [

  { title: 'dashboard', path: '', component: DashboardComponent, canActivate: [AuthGuard] },

  {  title: 'dashboard', path: 'admin', component: DashboardComponent, canActivate: [AuthGuard]},

  {  title: 'instituicaoFinanceira', path: 'financeiro/instituicao-financeira', component: InstituicoesFinanceirasComponent, canActivate: [AuthGuard]},

  { title: 'instituicaoFinanceiraUsuario', path: 'financeiro/instituicao-financeira-usuario', component: InstituicoesFinanceirasUsuarioComponent, canActivate: [AuthGuard]},

  { title: 'transasaoBancariaImportar', path: 'financeiro/transacoes-bancarias/importar', component: TransacaoBanariaImportarComponent, canActivate: [AuthGuard]},

  { title: 'despesa', path: 'financeiro/despesa', component: DespesasComponent, canActivate: [AuthGuard]},

  { title: 'despesaImportar', path: 'financeiro/despesa/importar', component: DespesasImportarComponent, canActivate: [AuthGuard]},

  { title: 'receita', path: 'financeiro/receita', component: ReceitasComponent, canActivate: [AuthGuard]},

  { title: 'modalSelecaoUsuario', path: 'modais-genericas/modal-selecao-usuario', component: ModalSelecaoUsuarioComponent, canActivate: [AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
