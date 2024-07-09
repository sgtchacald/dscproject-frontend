import { Component } from '@angular/core';
import {MenuItem, MessageService} from "primeng/api";
import {InstituicaoFinanceira} from "../../../../models/instituicao-financeira.model";
import {getAll, TipoInstituicaoFinanceiraEnum} from "../../../../models/tipo-instituicao-financeira";
import {UsuarioService} from "../../../../services/usuario/usuario.service";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {InstituicaoFinanceiraService} from "../../../../services/financeiro/instituicao-financeira.service";
import {ErroService} from "../../../../services/utils/erro.service";

@Component({
  selector: 'app-instituicoes-financeiras',
  templateUrl: './instituicoes-financeiras.component.html',
  styleUrls: ['./instituicoes-financeiras.component.scss']
})
export class InstituicoesFinanceirasComponent {

  breadcrumbItens: MenuItem[] | undefined;
  instituicao: InstituicaoFinanceira = new InstituicaoFinanceira(null, '', '');
  isSubmetido: boolean = false;
  exibirDialog: boolean = false;
  tipoInstituicaoFinanceiraList : { value: TipoInstituicaoFinanceiraEnum, label: string }[] = [];
  tipoInstituicaoFinanceiraSelecionada: TipoInstituicaoFinanceiraEnum | undefined;

  constructor(
    private messageService: MessageService,
    private instituicaoFinanceiraService: InstituicaoFinanceiraService,
    private erroService: ErroService
  ) {}


  ngOnInit() {
    this.breadcrumbItens = [
      {  icon: 'pi pi-home', routerLink: '/admin' },
      {  label: 'Financeiro' },
      {  label: 'Instituições' },
      {  label: 'Manter Instituição Financeira' }
    ];

    this.tipoInstituicaoFinanceiraList = getAll();
  }

  abrirModal() {
    this.isSubmetido = false;
    this.exibirDialog = true;
  }

  fecharModal() {
    this.exibirDialog = false;
    this.isSubmetido = false;
  }

  inserir(){
    this.isSubmetido = true;
    this.instituicao.tipoInstituicao = "";

    if(this.instituicao.nome && this.instituicao.tipoInstituicao){
        this.instituicaoFinanceiraService.cadastrar(this.instituicao).subscribe(
          () => {
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Cadastrado com sucesso.'});
            this.limpaCamposForm();
            this.fecharModal();
          },
          (error) => {
            let erro: string = this.erroService.retornaErroStatusCode(error);
            if(erro != ""){
              this.messageService.add({severity: 'error', summary: 'Erro', detail: erro });
            }
          }
        )
      }
  }

  limpaCamposForm(){
    this.instituicao = new InstituicaoFinanceira(null, '', '');
    this.tipoInstituicaoFinanceiraSelecionada = undefined;
  }

}
