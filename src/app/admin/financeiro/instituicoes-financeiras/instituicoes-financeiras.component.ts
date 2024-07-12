import { Component } from '@angular/core';
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {InstituicaoFinanceira} from "../../../../models/instituicao-financeira.model";
import {TipoInstituicaoFinanceiraEnum} from "../../../../enums/tipo-instituicao-financeira";
import {InstituicaoFinanceiraService} from "../../../../services/financeiro/instituicao-financeira.service";
import {ErroService} from "../../../../services/utils/erro.service";
import {EnumService} from "../../../../services/utils/enum.service";

@Component({
  selector: 'app-instituicoes-financeiras',
  templateUrl: './instituicoes-financeiras.component.html',
  styleUrls: ['./instituicoes-financeiras.component.scss']
})
export class InstituicoesFinanceirasComponent {

  breadcrumbItens: MenuItem[] | undefined;

  instituicao: InstituicaoFinanceira = new InstituicaoFinanceira(null, '', '');
  instituicaoList!: InstituicaoFinanceira[];
  instituicoesSelecionadasList!: InstituicaoFinanceira[];

  tipoInstituicaoFinanceiraList : { key: string, value: string }[] = [];
  tipoInstituicaoFinanceiraSelecionada: { key: string; value: string; } | undefined | null;

  isSubmetido: boolean = false;
  exibirDialog: boolean = false;
  prefixoModal: string | undefined = "";

  constructor(
    private instituicaoFinanceiraService: InstituicaoFinanceiraService,
    private enumService: EnumService,
    private messageService: MessageService,
    private erroService: ErroService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.breadcrumbItens = [
      {  icon: 'pi pi-home', routerLink: '/admin' },
      {  label: 'Financeiro' },
      {  label: 'Instituições' },
      {  label: 'Manter Instituição Financeira' }
    ];

    this.instituicaoFinanceiraService.buscarTodos().subscribe(instituicaoList => {
      this.instituicaoList = instituicaoList;
    });

    this.tipoInstituicaoFinanceiraList = this.enumService.getTipoInstituicoesFinanceiras();
  }

  inserir(){
    this.isSubmetido = true;
    this.instituicao.tipoInstituicao = this.tipoInstituicaoFinanceiraSelecionada?.key;

    if(
        this.instituicao.nome != null && this.instituicao.nome != "" && this.instituicao.nome != undefined
        && this.instituicao.tipoInstituicao != null && this.instituicao.tipoInstituicao != "" && this.instituicao.tipoInstituicao != undefined
    ){
      this.instituicaoFinanceiraService.cadastrar(this.instituicao).subscribe(
        () => {
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Cadastrado com sucesso.'});
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

  editar(){
    this.isSubmetido = true;
    this.instituicao.tipoInstituicao = this.tipoInstituicaoFinanceiraSelecionada?.key;

    if(
      this.instituicao.nome != null && this.instituicao.nome != "" && this.instituicao.nome != undefined
      && this.instituicao.tipoInstituicao != null && this.instituicao.tipoInstituicao != "" && this.instituicao.tipoInstituicao != undefined
    ){
      this.instituicaoFinanceiraService.editar(this.instituicao).subscribe(
        () => {
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Editado com sucesso.'});
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

  salvar(){
    if(this.instituicao.id === null){
      console.log("Salvou");
      this.inserir();
    }else{
      console.log("Editou");
      this.editar();
    }
  }

  abrirModal(instituicaoFinanceiraGrid: InstituicaoFinanceira | null) {

    this.prefixoModal = instituicaoFinanceiraGrid != null ? "Editar" : "Cadastrar";

    if(instituicaoFinanceiraGrid != null){

      this.instituicao = instituicaoFinanceiraGrid;

      if (this.instituicao.tipoInstituicao) {
        this.tipoInstituicaoFinanceiraSelecionada = this.enumService.getEnumPorKey(this.instituicao.tipoInstituicao, this.tipoInstituicaoFinanceiraList);
      }
    }

    this.isSubmetido = false;
    this.exibirDialog = true;
  }

  fecharModal() {
    this.limpaCamposForm();
    this.exibirDialog = false;
    this.isSubmetido = false;
  }

  limpaCamposForm(){
    this.instituicao = new InstituicaoFinanceira(null, '', '');
    this.tipoInstituicaoFinanceiraSelecionada = undefined;
  }

  excluir(instituicao: InstituicaoFinanceira) {

  }

  protected readonly HTMLInputElement = HTMLInputElement;

}
