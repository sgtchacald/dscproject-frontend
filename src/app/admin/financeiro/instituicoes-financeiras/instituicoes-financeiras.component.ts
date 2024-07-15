import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { InstituicaoFinanceira } from "../../../../models/instituicao-financeira.model";
import { TipoInstituicaoFinanceiraEnum } from "../../../../enums/tipo-instituicao-financeira";
import { InstituicaoFinanceiraService } from "../../../../services/financeiro/instituicao-financeira.service";
import { ErroService } from "../../../../services/utils/erro.service";
import { EnumService } from "../../../../services/utils/enum.service";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-instituicoes-financeiras',
  templateUrl: './instituicoes-financeiras.component.html',
  styleUrls: ['./instituicoes-financeiras.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class InstituicoesFinanceirasComponent {

  breadcrumbItens: MenuItem[] | undefined;

  instituicao: InstituicaoFinanceira = new InstituicaoFinanceira(null, '', '');
  instituicaoTemp: InstituicaoFinanceira = new InstituicaoFinanceira(null, '', '');
  instituicaoList: InstituicaoFinanceira[] = [];
  instituicoesSelecionadasList: InstituicaoFinanceira[] = [];

  tipoInstituicaoFinanceiraList: { key: string, value: string }[] = [];
  tipoInstituicaoFinanceiraSelecionada: { key: string; value: string; } | undefined | null;

  isSubmetido: boolean = false;
  exibirDialog: boolean = false;
  prefixoModal: string | undefined = "";

  constructor(
    private instituicaoFinanceiraService: InstituicaoFinanceiraService,
    private enumService: EnumService,
    private messageService: MessageService,
    private erroService: ErroService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.breadcrumbItens = [
      {icon: 'pi pi-home', routerLink: '/admin'},
      {label: 'Financeiro'},
      {label: 'Instituições'},
      {label: 'Manter Instituição Financeira'}
    ];

    this.atualizarTabela(true);

    this.tipoInstituicaoFinanceiraList = this.enumService.getTipoInstituicoesFinanceiras();
  }

  inserir() {
    this.isSubmetido = true;
    this.instituicaoTemp.tipoInstituicao = this.tipoInstituicaoFinanceiraSelecionada?.key;

    console.log(this.instituicaoTemp);

    if (
      this.instituicaoTemp.nome != null && this.instituicaoTemp.nome !== "" && this.instituicaoTemp.nome !== undefined &&
      this.instituicaoTemp.tipoInstituicao != null && this.instituicaoTemp.tipoInstituicao !== "" && this.instituicaoTemp.tipoInstituicao !== undefined
    ) {
      this.instituicaoFinanceiraService.cadastrar(this.instituicaoTemp).subscribe(
        () => {
          // Atualiza o objeto original após sucesso
          this.instituicao = { ...this.instituicaoTemp };

          //Faz o Push no novo item para a tabela.
          this.instituicaoList.push(this.instituicaoTemp);

          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Item cadastrado com sucesso.'});
          this.fecharModal();
          this.atualizarTabela(true); // Atualiza a tabela após inserir
        },
        (error) => {
          const erro: string = this.erroService.retornaErroStatusCode(error);
          if (erro !== "") {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: erro});
          }
        }
      );
    }
  }

  editar() {
    this.isSubmetido = true;
    let erro: string = "";

    console.log(this.instituicaoTemp);

    // Copia os valores do objeto temporário para o original
    this.instituicaoTemp.tipoInstituicao = this.tipoInstituicaoFinanceiraSelecionada?.key;

    if (
      this.instituicaoTemp.nome != null && this.instituicaoTemp.nome !== "" && this.instituicaoTemp.nome !== undefined &&
      this.instituicaoTemp.tipoInstituicao != null && this.instituicaoTemp.tipoInstituicao !== "" && this.instituicaoTemp.tipoInstituicao !== undefined
    ) {
      this.instituicaoFinanceiraService.editar(this.instituicaoTemp).subscribe(
        () => {
          // Atualiza o objeto original após sucesso
          this.instituicao = { ...this.instituicaoTemp };

          // Atualiza a lista de instituições
          const index = this.instituicaoList.findIndex(item => item.id === this.instituicao.id);
          if (index !== -1) {
            this.instituicaoList[index] = { ...this.instituicao };
          }

          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Item editado com sucesso.'});
          this.fecharModal();
          this.atualizarTabela(false); // Atualiza a tabela após editar
        },
        (error) => {
          erro = this.erroService.retornaErroStatusCode(error);
          if (erro !== "") {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: erro});
          }
        }
      );
    }
  }

  excluir(instituicaoFinanceiraGrid: InstituicaoFinanceira) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o item: <b>' + instituicaoFinanceiraGrid.nome + '</b>?',
      header: 'Confirmar Ação',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-primary mt-3",
      rejectButtonStyleClass: "p-button-danger mt-3 mr-3",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        this.instituicaoFinanceiraService.excluir(instituicaoFinanceiraGrid).subscribe(
          () => {
            const index = this.instituicaoList.findIndex(item => item.id === instituicaoFinanceiraGrid.id);
            if (index !== -1) {
              this.instituicaoList.splice(index, 1);
              this.atualizarTabela(false); // Atualiza a tabela após excluir
              this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Item [' + instituicaoFinanceiraGrid.nome +'] excluído com sucesso.'});
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
        let existeErro: boolean = false;

        for (let item of this.instituicoesSelecionadasList) {
          this.instituicaoFinanceiraService.excluir(item).subscribe(
            () => {
              const index = this.instituicaoList.findIndex(itemAExcluir => itemAExcluir.id === item.id);
              if (index !== -1) {
                this.instituicaoList.splice(index, 1);
                this.atualizarTabela(false); // Atualiza a tabela após excluir
                this.messageService.add({severity: 'info', summary: 'Notificação', detail: 'Item [' + item.nome +'] foi excluído.'});
              }
            },
            (error: HttpErrorResponse) => {
              let erro:string = this.erroService.retornaErroStatusCode(error);
              if (erro !== "") {
                this.messageService.add({severity: 'error', summary: 'Erro', detail: "Registro de id: " + item.id + " " + erro});
              }
            }
          );
        }

        if(!existeErro && this.instituicoesSelecionadasList.length > 1){
          //this.instituicaoList = this.instituicaoList.filter((val) => !this.instituicoesSelecionadasList?.includes(val));
          this.instituicoesSelecionadasList = [];
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Todos os itens foram excluídos com sucesso'});
        }

      }
    });

  }

  atualizarTabela(consumirAPI: boolean) {
    if(consumirAPI){
      this.instituicaoFinanceiraService.buscarTodos().subscribe(instituicaoList => {
        this.instituicaoList = instituicaoList;
      });
    }else{
      // Cria uma nova referência para forçar a atualização da tabela
      this.instituicaoList = [...this.instituicaoList];
    }
    this.cdr.detectChanges();
  }

  salvar(){
    if(this.instituicao.id === null){
      this.inserir();
    }else{
      this.editar();
    }
  }

  abrirModal(instituicaoFinanceiraGrid: InstituicaoFinanceira | null) {
    this.prefixoModal = instituicaoFinanceiraGrid ? "Editar" : "Cadastrar";
    this.instituicao = instituicaoFinanceiraGrid ? instituicaoFinanceiraGrid : new InstituicaoFinanceira(null, '', '');
    this.instituicaoTemp = { ...this.instituicao }; // Cria uma cópia para o objeto temporário
    if (this.instituicao.tipoInstituicao) {
      this.tipoInstituicaoFinanceiraSelecionada = this.enumService.getEnumPorKey(this.instituicao.tipoInstituicao, this.tipoInstituicaoFinanceiraList);
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
}
