import { Component } from '@angular/core';
import {MenuItem, MessageService} from "primeng/api";
import {InstituicaoFinanceira} from "../../../../models/instituicao-financeira.model";
import {TipoInstituicaoFinanceiraEnum} from "../../../../enums/tipo-instituicao-financeira";
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
  tipoInstituicaoFinanceiraList : { value: string, label: string }[] = [];
  tipoInstituicaoFinanceiraSelecionada: { value: string, label: string } | undefined;

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

    this.tipoInstituicaoFinanceiraList = TipoInstituicaoFinanceiraEnum.getAll();
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
    this.instituicao.tipoInstituicao = this.tipoInstituicaoFinanceiraSelecionada?.value;

    if(
        this.instituicao.nome != null && this.instituicao.nome != "" && this.instituicao.nome != undefined
        && this.instituicao.tipoInstituicao != null && this.instituicao.tipoInstituicao != "" && this.instituicao.tipoInstituicao != undefined
    ){
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
