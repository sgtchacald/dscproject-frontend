import {ChangeDetectorRef, Component, Renderer2, ViewChild} from '@angular/core';
import {ReceitaService} from "../../../../services/financeiro/receita.service";
import {ErroService} from "../../../../services/utils/erro.service";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {UtilsService} from "../../../../services/utils/utils.service";
import {InstituicaoFinanceiraUsuarioService} from "../../../../services/financeiro/instituicao-financeira-usuario.service";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {Receita} from "../../../../models/receita.model";
import {InstituicaoFinanceiraUsuario} from "../../../../models/instituicao-financeira-usuario.model";
import {HttpErrorResponse} from "@angular/common/http";
import {EnumService} from "../../../../services/utils/enum.service";

@Component({
  selector: 'app-receitas',
  templateUrl: './receitas.component.html',
  styleUrls: ['./receitas.component.scss']
})
export class ReceitasComponent {

  constructor(
    private receitaService: ReceitaService,
    private erroService: ErroService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private utils: UtilsService,
    private instituicaoFinanceiraUsuarioService: InstituicaoFinanceiraUsuarioService,
  ) {}

  @ViewChild('dt') dt: any;

  EnumService = EnumService;

  breadcrumbItens: MenuItem[] | undefined;
  receitasSelecionadasList: Receita[] = [];
  receitasList: Receita[] = [];
  receita: Receita = new Receita();
  loading: boolean = true;
  exibirDialogPesquisa: boolean = true;
  existeErro: boolean = false;
  receitaTemp: Receita = new Receita();
  isSubmetido: boolean = false;
  exibirDialogCadastroReceita: boolean = false;
  prefixoModal: string | undefined = "";

  anosCompetenciaList: any = [];
  mesesCompetenciaList: any = [];
  competenciaSelecionada: any;
  anoCompetenciaSelecionada: any;
  mesCompetenciaSelecionada: any;
  competenciaSelecionadaParaPesquisa: any;
  competenciaSelecionadaBreadcrumb: any;
  exibirOutrasCompetencias: boolean = false;

  tipoRegistroFinanceiroList: any = [];

  categoriaRegistroFinanceiroList:  any = [];
  categoriaRegistroFinanceiroSelecionado: { key: string; value: string; icon: string } | undefined | null;

  instituicoesFinanceirasUsuarioList: InstituicaoFinanceiraUsuario[] = [];
  instituicaoFinanceiraUsuarioSelecionada: InstituicaoFinanceiraUsuario | undefined | null;


  ngOnInit() {
    this.getCompeteciaSelecionada(false);

    this.competenciaSelecionadaBreadcrumb = this.competenciaSelecionadaParaPesquisa;

    this.breadcrumbItens = [
      {icon: 'pi pi-home', routerLink: '/admin'},
      {label:'Financeiro'},
      {label: 'Gerenciar Receitas'},
      {label: 'Competência Atual'},
      {label: this.competenciaSelecionadaBreadcrumb.value}
    ];

    this.loading = false;

    this.tipoRegistroFinanceiroList = EnumService.getTipoRegistroFinanceiro();

    this.getInstituicoesFinanceirasUsuario();

    this.atualizarTabela(true);

    this.aplicarFiltroPadrao();

  }

  onCompetenciaChange() {
    this.competenciaSelecionadaParaPesquisa = {
      key: this.anoCompetenciaSelecionada.key + "-" + this.mesCompetenciaSelecionada.key,
      value: this.mesCompetenciaSelecionada.value + " " + this.anoCompetenciaSelecionada.value,
    };

    if (this.exibirOutrasCompetencias && this.competenciaSelecionadaParaPesquisa) {
      this.aplicarFiltroPadrao(); // Filtra pela competência ao ser selecionada
    }
  }

  getCompeteciaSelecionada(indPreencheObjeto: boolean) {

    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    this.anosCompetenciaList = EnumService.getAnosCompetencia();
    this.mesesCompetenciaList = EnumService.getMesesCompetencia();

    let mesCompetencia = new Date().getMonth() - 1;
    let anoCorrente = new Date().getFullYear();

    if(mesCompetencia == -1){
      anoCorrente = anoCorrente - 1;
    }

    const mesAtual = mesCompetencia == -1 ? 11 : mesCompetencia;

    const competenciaAtual = meses.map((mes, index) => {
      const competencia = {
        key: `${anoCorrente}-${(index + 1).toString().padStart(2, '0')}`,
        value: `${mes} ${anoCorrente}`
      };

      const competenciaAnoSelecionado = {
        key: `${anoCorrente}`,
        value: `${anoCorrente}`,
      };

      const competenciaMesSelecionado = {
        key: `${(index + 1).toString().padStart(2, '0')}`,
        value: `${mes}`,
      };

      // Define a competência do mês atual como selecionada
      if (index === mesAtual) {
        if(indPreencheObjeto){
          this.competenciaSelecionada = competencia;
          this.anoCompetenciaSelecionada = competenciaAnoSelecionado;
          this.mesCompetenciaSelecionada = competenciaMesSelecionado;
        }else{
          this.competenciaSelecionadaParaPesquisa = competencia;
          this.anoCompetenciaSelecionada = competenciaAnoSelecionado;
          this.mesCompetenciaSelecionada = competenciaMesSelecionado;
        }
      }
      return competencia;
    });
  }

  aplicarFiltroPadrao($event?: Event) {
    if (!this.exibirOutrasCompetencias && this.competenciaSelecionadaParaPesquisa) {
      this.dt.filter(this.competenciaSelecionadaParaPesquisa.key, 'competencia', 'contains');
    } else {
      this.dt.clear(); // Remove o filtro caso esteja exibindo todas as competências
      this.dt.filter(this.competenciaSelecionadaParaPesquisa.key, 'competencia', 'contains');
    }
  }

  aplicarFiltroPadraoInputText($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    this.dt.filterGlobal(inputElement.value, "contains");
  }


  fecharModalPesquisa() {
    this.limpaCamposFormPesquisa();
    this.exibirDialogPesquisa = false;
  }

  limpaCamposFormPesquisa(){}

  pesquisar() {}

  abrirModalReceita(receitaGrid: Receita | null) {
    this.prefixoModal = (receitaGrid ? "Editar" : "Cadastrar") + " Receita";
    this.receita = receitaGrid ? receitaGrid : new Receita();
    this.receitaTemp = { ...this.receita }; // Cria uma cópia para o objeto temporário
    this.isSubmetido = false;
    this.exibirDialogCadastroReceita = true;

    this.filtrarCategoriasPorTipo("RECEITA");
    this.getCompeteciaSelecionada(true);

    if(receitaGrid?.id){

      let competenciaSplit = receitaGrid.competencia?.split("-");
      console.log(competenciaSplit);
      // @ts-ignore
      let ano = competenciaSplit[0];
      // @ts-ignore
      let mes = competenciaSplit[1];

      if(competenciaSplit){
        this.competenciaSelecionada = receitaGrid.competencia;

        this.anoCompetenciaSelecionada =  EnumService.getEnumPorKey(
          ano,
          this.anosCompetenciaList
        )

        this.mesCompetenciaSelecionada =  EnumService.getEnumPorKey(
          mes,
          this.mesesCompetenciaList
        )
      }

      console.log(this.competenciaSelecionada);
      console.log(this.anoCompetenciaSelecionada);
      console.log(this.mesCompetenciaSelecionada);

      this.receitaTemp.tipoRegistroFinanceiro = EnumService.getEnumPorKey(
        receitaGrid.tipoRegistroFinanceiro, EnumService.getCategoriaRegistroFinanceiro()
      );

      this.categoriaRegistroFinanceiroSelecionado = this.categoriaRegistroFinanceiroList[
        EnumService.getPosicaoEnumPorKey(
          receitaGrid.categoriaRegistroFinanceiro,
          this.categoriaRegistroFinanceiroList
        )
      ];

      this.instituicaoFinanceiraUsuarioSelecionada = this.instituicoesFinanceirasUsuarioList.find(item => item.id === receitaGrid.instituicaoFinanceiraUsuarioId);

    }else{
      this.limparCamposFormNovoReceita();
      this.getCompeteciaSelecionada(true);
    }
  }

  fecharModal() {
    this.limpaCamposForm();
    this.exibirDialogCadastroReceita = false;
    this.isSubmetido = false;
  }

  limparCamposFormNovoReceita() {
    this.competenciaSelecionada = {};
    this.categoriaRegistroFinanceiroSelecionado = null;
    this.instituicaoFinanceiraUsuarioSelecionada = null;
    this.receitaTemp = new Receita();
  }

  salvarReceita() {
    if(this.receita.id === null){
      this.inserir("RECEITA");
    }else{
      this.editar("RECEITA");
    }
  }

  private inserir(tipoRegistroFinanceiro: string) {
    this.isSubmetido = true;

    this.receitaTemp.tipoRegistroFinanceiro = tipoRegistroFinanceiro;
    this.receitaTemp.categoriaRegistroFinanceiro = this.categoriaRegistroFinanceiroSelecionado?.key;
    this.receitaTemp.instituicaoFinanceiraUsuarioId = this.instituicaoFinanceiraUsuarioSelecionada?.id;
    this.receitaTemp.competencia = this.competenciaSelecionada?.key

    if (
      this.isValid(this.categoriaRegistroFinanceiroSelecionado)
      && this.isValid(this.receitaTemp.descricao)
      && this.isValid(this.receitaTemp.valor)
      && this.isValid(this.receitaTemp.competencia)
    ) {
      this.receitaService.cadastrar(this.receitaTemp).subscribe(
        () => {
          // Atualiza o objeto original após sucesso
          this.receita = {...this.receitaTemp};

          //Faz o Push no novo item para a tabela.
          this.receitasList.push(this.receitaTemp);

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: this.translate.instant('message.cadastradoSucesso')
          });
          this.fecharModal();
          this.atualizarTabela(true); // Atualiza a tabela após inserir
        },(error : any) => {
          const erro: string = this.erroService.retornaErroStatusCode(error);
          if (erro !== "") {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: this.translate.instant('message.cadastradoErro') + " " + erro});
          }
        }
      );
    }
  }

  editar(tipoRegistroFinanceiro: string) {
    this.isSubmetido = true;
    let erro: string = "";

    this.receitaTemp.tipoRegistroFinanceiro = tipoRegistroFinanceiro;
    this.receitaTemp.competencia = this.competenciaSelecionada?.key;
    this.receitaTemp.categoriaRegistroFinanceiro = this.categoriaRegistroFinanceiroSelecionado?.key;
    this.receitaTemp.instituicaoFinanceiraUsuarioId = this.instituicaoFinanceiraUsuarioSelecionada?.id;

    if (this.isValid(this.receitaTemp.categoriaRegistroFinanceiro)
      && this.isValid(this.receitaTemp.descricao)
      && this.isValid(this.receitaTemp.valor)
      && this.isValid(this.receitaTemp.competencia)
    ) {
      this.receitaService.editar(this.receitaTemp).subscribe(
        () => {
          // Atualiza o objeto original após sucesso
          this.receita = { ...this.receitaTemp };

          // Atualiza a lista de instituições
          const index = this.receitasList.findIndex(item => item.id === this.receita.id);
          if (index !== -1) {
            this.receitasList[index] = { ...this.receita };
          }

          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: this.translate.instant('message.editadoSucesso')});
          this.fecharModal();
          this.atualizarTabela(false); // Atualiza a tabela após editar
        },
        (error) => {
          erro = this.erroService.retornaErroStatusCode(error);
          if (erro !== "") {
            this.messageService.add({severity: 'error', summary: 'Erro',  detail: this.translate.instant('message.cadastradoSucesso') + " " + erro });
          }
        }
      );
    }
  }

  excluir(receitaGrid: Receita) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o item: <b>' + receitaGrid.descricao + '</b>?',
      header: 'Confirmar Ação',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-primary mt-3",
      rejectButtonStyleClass: "p-button-danger mt-3 mr-3",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        this.receitaService.excluir(receitaGrid).subscribe(
          () => {
            const index = this.receitasList.findIndex(item => item.id === receitaGrid.id);
            if (index !== -1) {
              this.receitasList.splice(index, 1);
              this.atualizarTabela(false); // Atualiza a tabela após excluir

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: this.utils.substituiVariaveis(this.translate.instant('message.excluidoSucessoCustom'), { registro: receitaGrid.descricao })
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
        for (let item of this.receitasSelecionadasList) {
          this.receitaService.excluir(item).subscribe(
            () => {
              const index = this.receitasList.findIndex(itemAExcluir => itemAExcluir.id === item.id);
              if (index !== -1) {
                this.receitasList.splice(index, 1);
                this.atualizarTabela(false); // Atualiza a tabela após excluir
                this.messageService.add(
                  {
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.utils.substituiVariaveis(this.translate.instant('message.excluidoSucessoCustom'), { registro: item.descricao })
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
                    detail: this.utils.substituiVariaveis(this.translate.instant('message.excluidoErroCustom'), { registro: item.descricao }) + " " + erro
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
      this.receitaService.buscarTodos().subscribe(registrosList => {
        this.receitasList = registrosList;
        this.loading = false;
      });
    }else{
      // Cria uma nova referência para forçar a atualização da tabela
      this.receitasList = [...this.receitasList];
      this.loading = false;
    }
    this.cdr.detectChanges();
  }

  limpaCamposForm(){
    this.receita = new Receita();
    this.receitaTemp = new Receita();
  }

  filtrarCategoriasPorTipo(tipo: string) {
    // Obtém a lista completa e filtra com base no tipo
    const todasCategorias = EnumService.getCategoriaRegistroFinanceiro();

    this.categoriaRegistroFinanceiroList = todasCategorias.filter(
      categoria => categoria.tipoRegistroFinanceiro === tipo
    );

    // Limpa o valor selecionado no dropdown
    this.categoriaRegistroFinanceiroSelecionado = null;
  }

  isValid(value: any): boolean {
    return value !== null && value !== undefined && !(typeof value === 'string' && value.trim() === "");
  }

  getInstituicoesFinanceirasUsuario() {
    this.instituicaoFinanceiraUsuarioService.buscarTodos().subscribe(instFinUsu => {
      if(instFinUsu){
        this.instituicoesFinanceirasUsuarioList = instFinUsu;
      }
    });
  }

  setExibirOutrasCompetencias() {
    if (this.exibirOutrasCompetencias) {
      this.getCompeteciaSelecionada(false);
      this.dt.clear(); // Remove o filtro de competência
    } else {
      this.aplicarFiltroPadrao(); // Aplica o filtro pela competência selecionada
    }
  }


}
