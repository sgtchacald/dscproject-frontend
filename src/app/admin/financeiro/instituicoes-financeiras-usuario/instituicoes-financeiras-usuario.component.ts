import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {InstituicaoFinanceira} from "../../../../models/instituicao-financeira.model";
import {InstituicaoFinanceiraService} from "../../../../services/financeiro/instituicao-financeira.service";

import {ErroService} from "../../../../services/utils/erro.service";
import {TranslateService} from "@ngx-translate/core";
import {UtilsService} from "../../../../services/utils/utils.service";
import {HttpErrorResponse} from "@angular/common/http";
import {InstituicaoFinanceiraUsuario} from "../../../../models/instituicao-financeira-usuario.model";
import {
  InstituicaoFinanceiraUsuarioService
} from "../../../../services/financeiro/instituicao-financeira-usuario.service";

@Component({
  selector: 'app-instituicoes-financeiras-usuario',
  templateUrl: './instituicoes-financeiras-usuario.component.html',
  styleUrls: ['./instituicoes-financeiras-usuario.component.scss']
})
export class InstituicoesFinanceirasUsuarioComponent {
  @ViewChild('dt') dt: any;

  breadcrumbItens: MenuItem[] | undefined;
  loading: boolean = true;
  instituicaoFinanceiraUsuario: InstituicaoFinanceiraUsuario = new InstituicaoFinanceiraUsuario(null,'','','','', null);
  instituicaoFinanceiraUsuarioTemp: InstituicaoFinanceiraUsuario = new InstituicaoFinanceiraUsuario(null,'','','','', null);
  instituicoesFinanceirasUsuarioList: InstituicaoFinanceiraUsuario[] = [];
  instituicoesFinanceirasUsuarioSelecionadasList: InstituicaoFinanceiraUsuario[] = [];
  instituicoesFinanceirasList: InstituicaoFinanceira[] = [];
  instituicaoFinanceiraSelecionada: InstituicaoFinanceira | undefined | null;

  existeErro: boolean = false;
  isSubmetido: boolean = false;
  exibirDialog: boolean = false;
  prefixoModal: string | undefined = "";
  exibirCampoInstituicoesFinanceiras: boolean = true;

  constructor(
    private instituicaoFinanceiraUsuarioService: InstituicaoFinanceiraUsuarioService,
    private instituicaoFinanceiraService: InstituicaoFinanceiraService,
    private messageService: MessageService,
    private erroService: ErroService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.breadcrumbItens = [
      {icon: 'pi pi-home', routerLink: '/admin'},
      {label:'Financeiro'},
      {label: 'Instituições'},
      {label: 'Vincular Instituição Financeira ao Usuário'}
    ];

    this.atualizarTabela(true);

    this.getInstituicoesFinanceiras();
  }

  getInstituicoesFinanceiras(){
    this.instituicaoFinanceiraService.buscarTodos().subscribe(
      instFin => {
        this.instituicoesFinanceirasList = instFin;
        this.desabilitarOptionsInstituicoesFinanceiras();
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  desabilitarOptionsInstituicoesFinanceiras(){
    this.instituicoesFinanceirasList = this.instituicoesFinanceirasList.map(instituicao => ({
      ...instituicao,
      disabled: this.instituicoesFinanceirasUsuarioList.some(
        inst =>
          inst.instituicaoFinanceira
          && inst.instituicaoFinanceira.id
          && inst.instituicaoFinanceira.id === instituicao.id
      )
    }));
  }

  inserir() {
    this.isSubmetido = true;
    this.instituicaoFinanceiraUsuarioTemp.instituicaoFinanceira = this.instituicaoFinanceiraSelecionada;

    if(this.instituicaoFinanceiraUsuarioTemp.instituicaoFinanceira){
      this.instituicaoFinanceiraUsuarioService.cadastrar(this.instituicaoFinanceiraUsuarioTemp).subscribe(
        () => {
          // Atualiza o objeto original após sucesso
          this.instituicaoFinanceiraUsuario = { ...this.instituicaoFinanceiraUsuarioTemp };

          //Faz o Push no novo item para a tabela.
          this.instituicoesFinanceirasUsuarioList.push(this.instituicaoFinanceiraUsuarioTemp);

          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: this.translate.instant('message.cadastradoSucesso') });

          this.fecharModal();
          this.atualizarTabela(true); // Atualiza a tabela chamando endpoint após inserir para buscar id
        },
        (error) => {
          const erro: string = this.erroService.retornaErroStatusCode(error);
          if (erro !== "") {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: this.translate.instant('message.cadastradoErro') + " " + erro});
          }
        }
      );
    }
  }

  editar() {
    this.isSubmetido = true;
    let erro: string = "";

    // Copia os valores do objeto temporário para o original
    this.instituicaoFinanceiraUsuarioTemp.instituicaoFinanceira = this.instituicaoFinanceiraSelecionada;

    if(this.instituicaoFinanceiraUsuarioTemp.id && this.instituicaoFinanceiraUsuarioTemp.instituicaoFinanceira) {
      this.instituicaoFinanceiraUsuarioService.editar(this.instituicaoFinanceiraUsuarioTemp).subscribe(
        () => {
          // Atualiza o objeto original após sucesso
          this.instituicaoFinanceiraUsuario = {...this.instituicaoFinanceiraUsuarioTemp};

          // Atualiza a lista de instituições
          const index = this.instituicoesFinanceirasUsuarioList.findIndex(item => item.id === this.instituicaoFinanceiraUsuario.id);
          if (index !== -1) {
            this.instituicoesFinanceirasUsuarioList[index] = {...this.instituicaoFinanceiraUsuario};
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: this.translate.instant('message.editadoSucesso')
          });
          this.fecharModal();
          this.atualizarTabela(false); // Atualiza a tabela após editar
        },
        (error) => {
          erro = this.erroService.retornaErroStatusCode(error);
          if (erro !== "") {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: this.translate.instant('message.cadastradoErro') + " " + erro
            });
          }
        }
      );
    }

  }

  excluir(instituicaoFinanceiraUsuarioGrid: InstituicaoFinanceiraUsuario) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o item: <b>' + instituicaoFinanceiraUsuarioGrid.instituicaoFinanceira?.nome + '</b>?',
      header: 'Confirmar Ação',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-primary mt-3",
      rejectButtonStyleClass: "p-button-danger mt-3 mr-3",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        this.instituicaoFinanceiraUsuarioService.excluir(instituicaoFinanceiraUsuarioGrid).subscribe(
          () => {
            const index = this.instituicoesFinanceirasUsuarioList.findIndex(item => item.id === instituicaoFinanceiraUsuarioGrid.id);
            if (index !== -1) {
              this.instituicoesFinanceirasUsuarioList.splice(index, 1);
              this.atualizarTabela(false); // Atualiza a tabela após excluir

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: this.utils.substituiVariaveis(this.translate.instant('message.excluidoSucessoCustom'), { registro: instituicaoFinanceiraUsuarioGrid.instituicaoFinanceira?.nome })
              });
            }
          },
          (error: HttpErrorResponse) => {
            const erro: string = this.erroService.retornaErroStatusCode(error);
            if (erro !== "") {
              this.messageService.add({severity: 'error', summary: 'Erro', detail: erro });
            }
          }
        );
      }
    });
  }

  excluirSelecionados() {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir os itens selecionados?',
      header: 'Confirmar Ação',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-primary mt-3",
      rejectButtonStyleClass: "p-button-danger mt-3 mr-3",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        for (let item of this.instituicoesFinanceirasUsuarioSelecionadasList) {
          this.instituicaoFinanceiraUsuarioService.excluir(item).subscribe(
            () => {
              const index = this.instituicoesFinanceirasUsuarioList.findIndex(itemAExcluir => itemAExcluir.id === item.id);
              if (index !== -1) {
                this.instituicoesFinanceirasUsuarioList.splice(index, 1);
                this.atualizarTabela(false); // Atualiza a tabela após excluir
                this.messageService.add(
                  {
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.utils.substituiVariaveis(this.translate.instant('message.excluidoSucessoCustom'), { registro: item.instituicaoFinanceira?.nome })
                  }
                );
              }
            },
            (error: HttpErrorResponse) => {
              let erro:string = this.erroService.retornaErroStatusCode(error);
              if (erro !== "") {
                this.existeErro = true;
                this.messageService.add(
                  {
                    severity: 'error',
                    summary: 'Erro',
                    detail: this.utils.substituiVariaveis(this.translate.instant('message.excluidoErroCustom'), { registro: item.instituicaoFinanceira?.nome }) + " " + erro
                  }
                );
              }
            }
          );
        }
      }
    });

  }

  atualizarTabela(consumirAPI: boolean) {
    if(consumirAPI){
      this.instituicaoFinanceiraUsuarioService.buscarTodos().subscribe(instFinUsu => {
        this.instituicoesFinanceirasUsuarioList = instFinUsu;
        this.loading = false;
      });
    }else{
      // Cria uma nova referência para forçar a atualização da tabela
      this.instituicoesFinanceirasUsuarioList = [...this.instituicoesFinanceirasUsuarioList];
      this.loading = false;
    }
    this.cdr.detectChanges();
  }

  salvar(){
    if(this.instituicaoFinanceiraUsuario.id === null){
      this.inserir();
    }else{
      this.editar();
    }
  }

  abrirModal(instituicaoFinanceiraUsuarioGrid: InstituicaoFinanceiraUsuario | null) {
    this.prefixoModal = instituicaoFinanceiraUsuarioGrid ? "Editar" : "Cadastrar";
    this.instituicaoFinanceiraUsuario = instituicaoFinanceiraUsuarioGrid ? instituicaoFinanceiraUsuarioGrid : new InstituicaoFinanceiraUsuario(null,'','','','', null);
    this.instituicaoFinanceiraUsuarioTemp = { ...this.instituicaoFinanceiraUsuario }; // Cria uma cópia para o objeto temporário
    if (this.instituicaoFinanceiraUsuario.instituicaoFinanceira) {
      this.instituicaoFinanceiraSelecionada = this.instituicaoFinanceiraUsuario.instituicaoFinanceira;
    }
    this.isSubmetido = false;
    this.exibirDialog = true;
    let id: number | null | undefined = instituicaoFinanceiraUsuarioGrid?.id;
    this.exibirCampoInstituicoesFinanceiras = !id;
  }

  fecharModal() {
    this.limpaCamposForm();
    this.exibirDialog = false;
    this.isSubmetido = false;
  }

  limpaCamposForm(){
    this.instituicaoFinanceiraUsuario = new InstituicaoFinanceiraUsuario(null,'','','','', null);
    this.instituicaoFinanceiraSelecionada = undefined;
  }

  aplicarFiltroPadrao($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    this.dt.filterGlobal(inputElement.value, "contains");
  }
}
