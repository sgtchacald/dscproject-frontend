import {ChangeDetectorRef, Component, Renderer2, ViewChild} from '@angular/core';
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {Despesa} from "../../../../models/despesa.model";
import {EnumService} from "../../../../services/utils/enum.service";
import {InstituicaoFinanceiraUsuario} from "../../../../models/instituicao-financeira-usuario.model";
import {ErroService} from "../../../../services/utils/erro.service";
import {TranslateService} from "@ngx-translate/core";
import {HttpErrorResponse} from "@angular/common/http";
import {DespesaService} from "../../../../services/financeiro/despesa.service";
import {UtilsService} from "../../../../services/utils/utils.service";
import {InstituicaoFinanceiraUsuarioService} from "../../../../services/financeiro/instituicao-financeira-usuario.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ModalSelecaoUsuarioComponent} from "../../component-util/modais-genericas/modal-selecao-usuario/modal-selecao-usuario.component";
import {Usuario} from "../../../../models/usuario.model";
import {Observable} from "rxjs";
import {UsuarioService} from "../../../../services/usuario/usuario.service";

@Component({
  selector: 'app-despesas',
  templateUrl: './despesas.component.html',
  styleUrls: ['./despesas.component.scss']
})
export class DespesasComponent {

  constructor(
    private despesaService: DespesaService,
    private erroService: ErroService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private utils: UtilsService,
    private instituicaoFinanceiraUsuarioService: InstituicaoFinanceiraUsuarioService,
    private dialogService: DialogService,
    private renderer: Renderer2,
    private usuarioService: UsuarioService
  ) {}

  @ViewChild('dt') dt: any;
  protected readonly EnumService = EnumService;

  breadcrumbItens: MenuItem[] | undefined;

  despesasSelecionadasList: Despesa[] = [];
  despesasList: Despesa[] = [];
  despesa: Despesa = new Despesa();
  loading: boolean = true;
  exibirDialogPesquisa: boolean = true;
  existeErro: boolean = false;

  despesaTemp: Despesa = new Despesa();
  isSubmetido: boolean = false;
  exibirQtdParcela: boolean = false;
  exibirValorParcelado: boolean = false;
  exibirDialogCadastroDespesa: boolean = false;
  prefixoModal: string | undefined = "";

  tipoRegistroFinanceiroList: any = [];

  competenciasList: any[] = [];
  competenciaSelecionada: any;
  competenciaSelecionadaParaPesquisa: any;
  competenciaSelecionadaBreadcrumb: any;
  exibirOutrasCompetencias: boolean = false;

  categoriaRegistroFinanceiroList:  any = [];
  categoriaRegistroFinanceiroSelecionado: { key: string; value: string; icon: string } | undefined | null;

  parcelasList: { key: string, value: number }[] = [];
  parcelaSelecionada :{ key: string; value: number; } | undefined | null;

  statusPagamentoList:  any = [];
  statusPagamentoSelecionado: any = null;

  existePrestacaoList:  any = [];
  existePrestacaoSelecionada: any = null;

  instituicoesFinanceirasUsuarioList: InstituicaoFinanceiraUsuario[] = [];
  instituicaoFinanceiraUsuarioSelecionada: InstituicaoFinanceiraUsuario | undefined;

  isDividirDespesa: boolean = false;

  isModalUsuarioAberta: boolean = false;

  ref: DynamicDialogRef | undefined;

  usuarioLogadoObservable: Observable<Usuario | null> = new Observable<Usuario | null>();
  usuarioSelecionadoList: Usuario[] = [];
  usuarioLogado: Usuario | undefined;

  isDividirIgualmente: boolean = false;

  msgErroDivisaoDespesas: string = "";



  ngOnInit() {
    this.getCompeteciaSelecionada(false);

    this.competenciaSelecionadaBreadcrumb = this.competenciaSelecionadaParaPesquisa;

    this.breadcrumbItens = [
      {icon: 'pi pi-home', routerLink: '/admin'},
      {label:'Financeiro'},
      {label: 'Gerenciar Despesas'},
      {label: 'Competência Atual'},
      {label: this.competenciaSelecionadaBreadcrumb.value}
    ];


    this.loading = false;

    this.tipoRegistroFinanceiroList = EnumService.getTipoRegistroFinanceiro();

    // Gerar a lista de dias de 1 a 31
    for (let i = 2; i <= 36; i++) {
      this.parcelasList.push({ key: i.toString(), value: i });
    }

    this.statusPagamentoList = EnumService.getStatusSimNao();

    this.existePrestacaoList = EnumService.getStatusSimNao();

    this.exibirQtdParcela = false;
    this.exibirValorParcelado = false;

    this.getInstituicoesFinanceirasUsuario();

    this.usuarioLogadoObservable = this.usuarioService.retornaUsuario();
    this.usuarioLogadoObservable.subscribe(usuario => {
      if (usuario) {
        this.usuarioLogado = usuario;
      }
    });

    this.atualizarTabela(true);

    this.aplicarFiltroPadrao();
  }

  onCompetenciaChange() {
    if (this.exibirOutrasCompetencias && this.competenciaSelecionadaParaPesquisa) {
      this.aplicarFiltroPadrao(); // Filtra pela competência ao ser selecionada
    }
  }

  getCompeteciaSelecionada(indPreencheObjeto: boolean) {
    const anoCorrente = new Date().getFullYear();
    const mesAtual = new Date().getMonth() - 1; // Retorna de 0 (Janeiro) a 11 (Dezembro)

    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    this.competenciasList = meses.map((mes, index) => {
      const competencia = {
        key: `${anoCorrente}-${(index + 1).toString().padStart(2, '0')}`,
        value: `${mes} ${anoCorrente}`
      };

      // Define a competência do mês atual como selecionada
      if (index === mesAtual) {
        if(indPreencheObjeto){
          this.competenciaSelecionada = competencia;
        }else{
          this.competenciaSelecionadaParaPesquisa = competencia;
        }
      }

      return competencia;
    });
  }

  aplicarFiltroPadrao($event?: Event) {
    if (!this.exibirOutrasCompetencias && this.isValid(this.competenciaSelecionadaParaPesquisa)) {
      this.dt.filter(this.competenciaSelecionadaParaPesquisa.key, 'competencia', 'contains');
    } else {
      this.dt.clear(); // Remove o filtro caso esteja exibindo todas as competências
      if(this.isValid(this.competenciaSelecionadaParaPesquisa)){
        this.dt.filter(this.competenciaSelecionadaParaPesquisa.key, 'competencia', 'contains');
      }
    }
  }

  aplicarFiltroPadraoInputText($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    this.dt.filterGlobal(inputElement.value, "contains");
  }

  fecharModalPesquisa() {
    this.exibirDialogPesquisa = false;
  }

  retornaSeverityDtVencimento(dtVencimento: any, statusPagamento: any) {

    dtVencimento = new Date(dtVencimento).toISOString();

    if(this.isValid(dtVencimento)){
      const partes = dtVencimento.split("T")[0].split("-"); // Pega apenas YYYY-MM-DD
      dtVencimento = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2])); // Mês começa do zero
    }

    // Criar um objeto Date para hoje e zerar as horas
    let hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dtVencimento.getTime() < hoje.getTime() && statusPagamento === "NAO") {
      return "danger";
    }

    if (dtVencimento.getTime() === hoje.getTime() && statusPagamento === "NAO") {
      return "warning";
    }

    return null;
  }

  abrirModalDespesa(despesaGrid: Despesa | null) {
    this.prefixoModal = (despesaGrid ? "Editar" : "Cadastrar") + " Despesa";
    this.despesa = despesaGrid ? despesaGrid : new Despesa();
    this.despesaTemp = { ...this.despesa }; // Cria uma cópia para o objeto temporário
    this.isSubmetido = false;
    this.exibirDialogCadastroDespesa = true;

    this.filtrarCategoriasPorTipo("DESPESA");

    this.statusPagamentoSelecionado = this.statusPagamentoList[1];
    this.existePrestacaoSelecionada = this.existePrestacaoList[1];

    if(despesaGrid?.id){

      this.competenciaSelecionada = this.competenciasList[
        EnumService.getPosicaoEnumPorKey(
          despesaGrid.competencia,
          this.competenciasList
        )
      ];

      this.despesaTemp.tipoRegistroFinanceiro = EnumService.getEnumPorKey(
        despesaGrid.tipoRegistroFinanceiro, EnumService.getCategoriaRegistroFinanceiro()
      );

      this.statusPagamentoSelecionado = this.statusPagamentoList[
        EnumService.getPosicaoEnumPorKey(
          despesaGrid.statusPagamento,
          this.statusPagamentoList
        )
      ];

      this.categoriaRegistroFinanceiroSelecionado = this.categoriaRegistroFinanceiroList[
        EnumService.getPosicaoEnumPorKey(
          despesaGrid.categoriaRegistroFinanceiro,
          this.categoriaRegistroFinanceiroList
        )
      ];

      //converte as datas para o componente p-calendar
      let partesDtLancamento = despesaGrid.dtLancamento?.toString().split('-');
      let partesDtVencimento = despesaGrid.dtVencimento?.toString().split('-');

      console.log(partesDtVencimento);
      console.log(partesDtLancamento);


      if (partesDtLancamento) {
        this.despesaTemp.dtLancamento = new Date(+partesDtLancamento[0], +partesDtLancamento[1] - 1, +partesDtLancamento[2]);
      }

      if (partesDtVencimento) {
        this.despesaTemp.dtVencimento = new Date(+partesDtVencimento[0], +partesDtVencimento[1] - 1, +partesDtVencimento[2]);
      }

      //Seleciona Instituicao Financeira
      this.instituicaoFinanceiraUsuarioSelecionada = this.instituicoesFinanceirasUsuarioList.find(item => item.id === despesaGrid.instituicaoFinanceiraUsuarioId);

      this.existePrestacaoSelecionada = this.existePrestacaoList[
        EnumService.getPosicaoEnumPorKey(
          despesaGrid.categoriaRegistroFinanceiro,
          this.categoriaRegistroFinanceiroList
        )
      ];

      //Configura o parcelamento
      // @ts-ignore
      if(this.isValid(despesaGrid.qtdParcela) && despesaGrid.qtdParcela > 1){
        this.atualizarExistePrestacaoSelecionada(this.existePrestacaoList[0]);
        // @ts-ignore
        this.parcelaSelecionada = this.parcelasList[despesaGrid.qtdParcela - 2];
      }else{
        this.atualizarExistePrestacaoSelecionada(this.existePrestacaoList[1]);
      }

      //Preenche a parte da divisão
      console.log(despesaGrid);
      if(Number(despesaGrid.usuariosResponsaveis.length) > 1){
        this.isDividirDespesa = true;
        this.usuarioSelecionadoList = despesaGrid.usuariosResponsaveis;
      }
    }else{
      this.limparCamposFormNovoDespesa();
      this.getCompeteciaSelecionada(true);
    }
  }

  fecharModal() {
    this.limpaCamposForm();
    this.exibirDialogCadastroDespesa = false;
    this.isSubmetido = false;
  }

  limparCamposFormNovoDespesa() {
    this.despesaTemp = new Despesa();
    this.parcelaSelecionada = null;
    this.exibirValorParcelado = false;
    this.exibirQtdParcela = false;
  }

  salvarDespesa() {
    if(!this.isValid(this.validarDivisaoDespesa())){
      if(this.despesa.id === null){
        this.inserir("DESPESA");
      }else{
        this.editar("DESPESA");
      }
    }
  }

  private inserir(tipoRegistroFinanceiro: string) {
    this.isSubmetido = true;

    this.despesaTemp.tipoRegistroFinanceiro = tipoRegistroFinanceiro;
    this.despesaTemp.categoriaRegistroFinanceiro = this.categoriaRegistroFinanceiroSelecionado?.key;
    this.despesaTemp.instituicaoFinanceiraUsuarioId = this.instituicaoFinanceiraUsuarioSelecionada?.id;
    this.despesaTemp.qtdParcela = this.parcelaSelecionada?.value;
    this.despesaTemp.statusPagamento = this.statusPagamentoSelecionado?.key;
    this.despesaTemp.competencia = this.competenciaSelecionada?.key;
    this.despesaTemp.existeParcela = this.existePrestacaoSelecionada.key == "SIM";
    this.despesaTemp.nrParcela = 1;

    const dtVencimento = this.despesaTemp.dtVencimento;
    const dtLancamento = this.despesaTemp.dtLancamento;

    if(this.isValid(dtVencimento)) {
      this.despesaTemp.dtVencimento = this.formatarDataParaEnvio(dtVencimento);
    }

    if(this.isValid(dtLancamento)) {
      this.despesaTemp.dtLancamento = this.formatarDataParaEnvio(dtLancamento);
    }

    this.despesaTemp.usuariosResponsaveis = [];

    this.usuarioSelecionadoList.forEach(usuario => {
      this.despesaTemp.usuariosResponsaveis.push(usuario)
    });

    if(
        ( this.despesaTemp.usuariosResponsaveis.length === 0 && this.usuarioLogado) ||
        ( this.despesaTemp.usuariosResponsaveis.length === 1 && this.despesaTemp.usuariosResponsaveis[0].id === this.usuarioLogado?.id )
    ){

        let usuario: Usuario = {
          id: this.usuarioLogado.id,
          nome: this.usuarioLogado.nome,
          genero: this.usuarioLogado.genero,
          email: this.usuarioLogado.email,
          login: this.usuarioLogado.login,
          senha: "",
          valorDividido: this.despesaTemp.valor ?? 0,
          statusPagamento: this.despesaTemp.statusPagamento === "SIM",
          logado: true
        };

        //Criando um novo array com um NOVO objeto (spread operator para forçar nova referência)
        this.despesaTemp.usuariosResponsaveis = [...this.despesaTemp.usuariosResponsaveis, { ...usuario }];
    }

    if (
      this.isValid(this.categoriaRegistroFinanceiroSelecionado)
      && this.isValid(this.despesaTemp.descricao)
      && this.isValid(this.despesaTemp.valor)
      && this.isValid(this.despesaTemp.statusPagamento)
      && this.isValid(this.despesaTemp.competencia)
    ) {
      this.despesaService.cadastrar(this.despesaTemp).subscribe(
        () => {
          // Atualiza o objeto original após sucesso
          this.despesa = {...this.despesaTemp};

          //Faz o Push no novo item para a tabela.
          this.despesasList.push(this.despesaTemp);

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: this.translate.instant('message.cadastradoSucesso')
          });
          this.fecharModal();
          this.atualizarTabela(true);
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

    this.despesaTemp.tipoRegistroFinanceiro = tipoRegistroFinanceiro;
    this.despesaTemp.competencia = this.competenciaSelecionada?.key;
    this.despesaTemp.categoriaRegistroFinanceiro = this.categoriaRegistroFinanceiroSelecionado?.key;
    this.despesaTemp.instituicaoFinanceiraUsuarioId = this.instituicaoFinanceiraUsuarioSelecionada?.id;

    if(this.existePrestacaoSelecionada.key === "NAO"){
      this.despesaTemp.qtdParcela = 0;
      this.parcelaSelecionada = null;
    }else{
      this.despesaTemp.qtdParcela = this.parcelaSelecionada?.value;
    }

    this.despesaTemp.statusPagamento = this.statusPagamentoSelecionado?.key;

    const dtLancamento = this.despesaTemp.dtLancamento;
    const dtVencimento = this.despesaTemp.dtVencimento;

    if(this.isValid(dtLancamento)) {
      this.despesaTemp.dtLancamento = this.formatarDataParaEnvio(dtLancamento?.toString());
    }

    if(this.isValid(dtVencimento)) {
      this.despesaTemp.dtVencimento = this.formatarDataParaEnvio(dtVencimento?.toString());
    }

    this.despesaTemp.usuariosResponsaveis = [];

    this.usuarioSelecionadoList.forEach(usuario => {
      this.despesaTemp.usuariosResponsaveis.push(usuario)
    });

    if(
      ( this.despesaTemp.usuariosResponsaveis.length === 0 && this.usuarioLogado) ||
      ( this.despesaTemp.usuariosResponsaveis.length === 1 && this.despesaTemp.usuariosResponsaveis[0].id === this.usuarioLogado?.id )
    ){

      let usuario: Usuario = {
        id: this.usuarioLogado.id,
        nome: this.usuarioLogado.nome,
        genero: this.usuarioLogado.genero,
        email: this.usuarioLogado.email,
        login: this.usuarioLogado.login,
        senha: "",
        valorDividido: this.despesaTemp.valor ?? 0,
        statusPagamento: this.despesaTemp.statusPagamento === "SIM",
        logado: true
      };

      //Criando um novo array com um NOVO objeto (spread operator para forçar nova referência)
      this.despesaTemp.usuariosResponsaveis = [...this.despesaTemp.usuariosResponsaveis, { ...usuario }];
    }

    if (this.isValid(this.despesaTemp.categoriaRegistroFinanceiro)
      && this.isValid(this.despesaTemp.descricao)
      && this.isValid(this.despesaTemp.valor)
      && this.isValid(this.despesaTemp.qtdParcela)
      && this.isValid(this.despesaTemp.statusPagamento)
      && this.isValid(this.despesaTemp.competencia)
    ) {
      this.despesaService.editar(this.despesaTemp).subscribe(
        () => {
          // Atualiza o objeto original após sucesso
          this.despesa = { ...this.despesaTemp };

          // Atualiza a lista de instituições
          const index = this.despesasList.findIndex(item => item.id === this.despesa.id);
          if (index !== -1) {
            this.despesasList[index] = { ...this.despesa };
          }

          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: this.translate.instant('message.editadoSucesso')});
          this.fecharModal();
          this.atualizarTabela(true); // Atualiza a tabela após editar
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

  excluir(despesaGrid: Despesa) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o item: <b>' + despesaGrid.descricao + '</b>?',
      header: 'Confirmar Ação',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-primary mt-3",
      rejectButtonStyleClass: "p-button-danger mt-3 mr-3",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        this.despesaService.excluir(despesaGrid).subscribe(
          () => {
            const index = this.despesasList.findIndex(item => item.id === despesaGrid.id);
            if (index !== -1) {
              this.despesasList.splice(index, 1);
              this.atualizarTabela(false); // Atualiza a tabela após excluir

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: this.utils.substituiVariaveis(this.translate.instant('message.excluidoSucessoCustom'), { registro: despesaGrid.descricao })
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
        for (let item of this.despesasSelecionadasList) {
          this.despesaService.excluir(item).subscribe(
            () => {
              const index = this.despesasList.findIndex(itemAExcluir => itemAExcluir.id === item.id);
              if (index !== -1) {
                this.despesasList.splice(index, 1);
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

  compartilharSelecionados() {
    this.confirmationService.confirm({
      header: 'Confirmar divisão de itens por lote',

      message: 'Tem certeza que deseja compartilhar os vários itens selecionados?' +
        '<br><br>' +
        '<span class="text-red-500">A divisão feita pelo botão compartilhar irá automáticamente dividir os valores dos itens por 2 duas partes iguais.</span>' +
        '<br><br>' +
        '<span class="text-red-500">Para Dividir um item de forma personalizada, faça a divisão editando um item de cada vez.</span>',

      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-primary mt-3",
      rejectButtonStyleClass: "p-button-danger mt-3 mr-3",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {

        let idDespesaList: number[] = [];
        let idusuariosACompartilharList: number[] = [];

        for (let item of this.despesasSelecionadasList) {
          if (item.id != null) {
            idDespesaList.push(item.id);
          }
        }

        for (let item of this.usuarioSelecionadoList) {
          if (item.id != null) {
            idusuariosACompartilharList.push(Number(item.id));
          }
        }

        this.despesaService.compartilharDespesas(idDespesaList, idusuariosACompartilharList).subscribe(
          () => {
            this.atualizarTabela(true);
            this.messageService.add(
              {
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Registro(s) compartilhado(s) com sucesso',
              }
            );
          },
          (error: HttpErrorResponse) => {
            let erro:string = this.erroService.retornaErroStatusCode(error);
            if (erro !== "") {
              this.existeErro = true;
              this.messageService.add(
                {
                  severity: 'error',
                  summary: 'Erro',
                  detail: erro
                }
              );
            }
          }
        );
      },
      reject: () => {
      }
    });
  }

  pagarSelecionados() {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja pagar os itens selecionados?',
      header: 'Confirmar Ação',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-primary mt-3",
      rejectButtonStyleClass: "p-button-danger mt-3 mr-3",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {

        let idDespesaList: number[] = [];

        for (let item of this.despesasSelecionadasList) {
          if (item.id != null) {
            idDespesaList.push(item.id);
          }
        }

        this.despesaService.pagarDespesas(idDespesaList).subscribe(
          () => {
              this.atualizarTabela(true);
              this.messageService.add(
                {
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: 'Registro(s) pago(s) com sucesso',
                }
              );
          },
          (error: HttpErrorResponse) => {
            let erro:string = this.erroService.retornaErroStatusCode(error);
            if (erro !== "") {
              this.existeErro = true;
              this.messageService.add(
                {
                  severity: 'error',
                  summary: 'Erro',
                  detail: erro
                }
              );
            }
          }
        );
      }
    });
  }

  atualizarTabela(consumirAPI: boolean) {
    if(consumirAPI){
      this.despesaService.buscarTodos().subscribe(registrosList => {
        this.despesasList = registrosList;
        this.loading = false;
      });
    }else{
      // Cria uma nova referência para forçar a atualização da tabela
      this.despesasList = [...this.despesasList];
      this.loading = false;
    }
    this.cdr.detectChanges();
  }

  limpaCamposForm(){
    this.despesa = new Despesa();

    this.despesaTemp = new Despesa();

    this.existePrestacaoSelecionada = null;

    this.isDividirDespesa = false;
    this.usuarioSelecionadoList = [];
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

  validarData(event: any) {
    let input = event.target.value;

    // Remove caracteres não numéricos (exceto barras já adicionadas)
    input = input.replace(/[^0-9/]/g, '');

    // Adiciona a barra automaticamente após 2 e 5 caracteres
    if (input.length === 2 || input.length === 5) {
      if (!input.endsWith('/')) {
        input += '/';
      }
    }

    // Limita o comprimento máximo para "dd/mm/yyyy"
    if (input.length > 10) {
      input = input.slice(0, 10);
    }

    event.target.value = input;
  }

  formatarDataParaEnvio(pData: string | Date | null | undefined) {
    if (pData) {
      const data = new Date(pData);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();

      return `${ano}-${mes}-${dia}`;
    }
    return '';
  }

  // Converte uma string dd/MM/aaaa para Date
  converterStringParaDate(dataString: string | undefined | null): Date | null {
    if (!dataString) return null;

    const [dia, mes, ano] = dataString.split('/');
    return new Date(+ano, +mes - 1, +dia); // Mês começa do 0
  }

  formatarDataHoraParaEnvio(pData: string | undefined | null) {
    if (pData) {
      const data = new Date(pData);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      const horas = String(data.getHours()).padStart(2, '0');
      const minutos = String(data.getMinutes()).padStart(2, '0');
      const segundos = String(data.getSeconds()).padStart(2, '0');

      return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
    }
    return '';
  }

  formatarDataHoraSQLParaEnvio(pData: string | undefined | null) {
    if (pData) {
      const data = new Date(pData);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      const horas = String(data.getHours()).padStart(2, '0');
      const minutos = String(data.getMinutes()).padStart(2, '0');
      const segundos = String(data.getSeconds()).padStart(2, '0');

      return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    }
    return '';
  }

  isValid(value: any): boolean {
    return value !== null && value !== undefined && !(typeof value === 'string' && value.trim() === "");
  }

  atualizarExistePrestacaoSelecionada(existePrestacaoSelecionada: any) {
    this.existePrestacaoSelecionada = existePrestacaoSelecionada;
    this.exibirQtdParcela = this.existePrestacaoSelecionada.key == "SIM";
    this.exibirValorParcelado = this.existePrestacaoSelecionada.key == "SIM";
  }

  getInstituicoesFinanceirasUsuario() {
      this.instituicaoFinanceiraUsuarioService.buscarTodos().subscribe(instFinUsu => {
        if(instFinUsu){
          this.instituicoesFinanceirasUsuarioList = instFinUsu;
        }
      });
  }

  exibirModalUsuarios(compartilharComVariosUsuarios: boolean, isModalUsuarioAberta: boolean) {
    this.isModalUsuarioAberta = isModalUsuarioAberta;

    if(compartilharComVariosUsuarios){
      this.isDividirDespesa = true;
    }

    if (this.isDividirDespesa){
      this.ref = this.dialogService.open(ModalSelecaoUsuarioComponent, {
        header: 'Selecione o(s) usuário(s) para dividir a(s) despesa(s)',
        width: '50%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
      });

      this.ref.onClose.subscribe((result: any) => {
        if (result) {
          this.usuarioSelecionadoList = result;
          // Modal foi fechada com um resultado (ex: usuário confirmou algo)
          console.log('Usuário selecionado:', result);
        } else {
          // Modal foi fechada pelo botão X ou cancelamento
          console.log('Modal fechada sem ação');
        }

      });
    }else{
      this.usuarioSelecionadoList = [];
      this.despesaTemp.usuariosResponsaveis = [];
    }

    if(compartilharComVariosUsuarios && this.isModalUsuarioAberta){
      this.compartilharSelecionados();
    }

  }

  excluirDivisao(usuario: Usuario) {
    const index = this.usuarioSelecionadoList.findIndex(item => item.id === usuario.id);
    if (index !== -1) {
      this.despesasList.splice(index, 1);
      const elemento = document.getElementById("usuarioSelecionadoItem" + usuario.login);

      if (elemento) {
        this.renderer.removeChild(elemento.parentElement, elemento);
        this.isDividirDespesa = !!this.despesasList.length;
      }
    }

    this.usuarioSelecionadoList = this.usuarioSelecionadoList.filter(u => u.id !== usuario.id);
    this.despesaTemp.usuariosResponsaveis = this.despesaTemp.usuariosResponsaveis.filter(u => u.id !== usuario.id);
  }

  calcularTotalGeral(): number {
    let valor: number =   0

    if(this.isValid(this.competenciaSelecionadaParaPesquisa)){
      valor = this.despesasList.filter(
        registro =>
          registro.tipoRegistroFinanceiro === 'DESPESA' &&
          registro.competencia === this.competenciaSelecionadaParaPesquisa.key
      ).reduce((total, registro) => total + (this.retornaColunaValor(registro) || 0), 0);
    }else{
      valor = this.despesasList.filter(
        registro =>
          registro.tipoRegistroFinanceiro === 'DESPESA' // Filtra apenas DESPESAS
      ).reduce((total, registro) => total + (this.retornaColunaValor(registro) || 0), 0);
    }

    if(valor !== null){
      return valor;
    }

    return 0;

  }

  calcularTotalAPagar(): string {
    let valor: number = 0;

    if (!this.exibirOutrasCompetencias) {
      valor = this.despesasList.filter(
        registro =>
          registro.tipoRegistroFinanceiro === 'DESPESA' && // Filtra apenas DESPESAS
          registro.statusPagamento === 'NAO' && // Filtra apenas pagamentos com status "SIM"
          registro.competencia === this.competenciaSelecionadaBreadcrumb.key  // Filtra por competencia
      ).reduce(
        (total, registro) => total + (this.retornaColunaValor(registro) || 0), 0
      );
    } else {
      if(this.isValid(this.competenciaSelecionadaParaPesquisa)){
        valor = this.despesasList.filter(
          registro =>
            registro.tipoRegistroFinanceiro === 'DESPESA' &&
            registro.statusPagamento === 'NAO' &&
            registro.competencia === this.competenciaSelecionadaParaPesquisa.key
        ).reduce(
          (total, registro) => total + (this.retornaColunaValor(registro) || 0), 0
        );
      }else{
        valor = this.despesasList.filter(
          registro =>
            registro.tipoRegistroFinanceiro === 'DESPESA' &&
            registro.statusPagamento === 'NAO'
        ).reduce(
          (total, registro) => total + (this.retornaColunaValor(registro) || 0), 0
        );
      }
    }

    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  calcularTotalPago(): string {

    let valor: number = 0;

    if (!this.exibirOutrasCompetencias) {
      valor = this.despesasList.filter(
        registro =>
          registro.tipoRegistroFinanceiro === 'DESPESA' && // Filtra apenas DESPESAS
          registro.statusPagamento === 'SIM' && // Filtra apenas pagamentos com status "SIM"
          registro.competencia === this.competenciaSelecionadaBreadcrumb.key  // Filtra por competencia
      ).reduce(
        (total, registro) => total + (this.retornaColunaValor(registro) || 0), 0
      );
    }else{
      if(this.isValid(this.competenciaSelecionadaParaPesquisa)){
        valor = this.despesasList.filter(
          registro =>
            registro.tipoRegistroFinanceiro === 'DESPESA' && // Filtra apenas DESPESAS
            registro.statusPagamento === 'SIM' &&// Filtra apenas pagamentos com status "SIM"
            registro.competencia === this.competenciaSelecionadaParaPesquisa.key  // Filtra por competencia
        ).reduce(
          (total, registro) => total + (this.retornaColunaValor(registro) || 0), 0
        );
      }else{
        valor = this.despesasList.filter(
          registro =>
            registro.tipoRegistroFinanceiro === 'DESPESA' && // Filtra apenas DESPESAS
            registro.statusPagamento === 'SIM' // Filtra apenas pagamentos com status "SIM"
        ).reduce(
          (total, registro) => total + (this.retornaColunaValor(registro) || 0), 0
        );
      }
    }

    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

  }

  calcularTotalCompartilhado(): string {
    let valor: number = 0;

    if (!this.exibirOutrasCompetencias) {
      valor = this.despesasList.filter(
        registro =>
          registro.existeDivisao && // Filtra apenas pagamentos com status "SIM"
          registro.competencia === this.competenciaSelecionadaBreadcrumb.key  // Filtra por competencia
      ).reduce((total, registro) => total + (this.retornaColunaValor(registro) || 0), 0);
    }else{
      if(this.isValid(this.competenciaSelecionadaParaPesquisa)){
        valor = this.despesasList.filter(
          registro =>
            registro.existeDivisao &&
            registro.competencia === this.competenciaSelecionadaParaPesquisa.key  // Filtra por competencia
        ).reduce((total, registro) => total + (this.retornaColunaValor(registro) || 0), 0);
      }else{
        valor = this.despesasList.filter(registro => registro.existeDivisao).reduce(
          (total, registro) => total + (this.retornaColunaValor(registro) || 0), 0
        );
      }
    }

    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

  }

  setExibirOutrasCompetencias() {

    if (this.exibirOutrasCompetencias) {
      this.getCompeteciaSelecionada(false);
      this.dt.clear(); // Remove o filtro de competência
      this.competenciaSelecionadaParaPesquisa = null;
    } else {
      this.competenciaSelecionadaParaPesquisa = this.competenciaSelecionadaBreadcrumb;
      this.aplicarFiltroPadrao(); // Aplica o filtro pela competência selecionada
    }
  }

  abrirModalParcelas(registro: any) {

  }

  // Calcula o valor parcelado automaticamente
  calcularParcelas() {
    if (this.despesaTemp.valorParcelado && this.parcelaSelecionada) {
      this.despesaTemp.valor = this.despesaTemp.valorParcelado / this.parcelaSelecionada.value;
    } else {
      this.despesaTemp.valorParcelado = null;
    }
  }

  atualizarTotal() {
    // Calcula o total dos valores informados na divisão
    /*let totalDividido = this.usuarioSelecionadoList
      .filter(usuario =>usuario.valorDividido > 0) // Filtra apenas valores positivos
      .reduce((acc, usuario) => acc + usuario.valorDividido, 0);

    // Atualiza o valor da despesa para refletir o restante
    // @ts-ignore
    this.despesaTemp.valor = this.valorOriginal - totalDividido;*/
  }

  dividirIgualmente() {

    if (!this.despesaTemp.valor || this.despesaTemp.valor <= 0) {
      this.resetDivisao(); // Se o valor for apagado, reinicia os campos
      return;
    }

    if (this.isDividirIgualmente) {
      let totalParticipantes = this.usuarioSelecionadoList.length; // Usuários + o próprio campo despesaTemp.valor

      if (totalParticipantes > 0) {

        // @ts-ignore
        let valorPorParte = this.despesaTemp.valor / totalParticipantes; // Divide entre todos os envolvidos

        // Atualiza o valor de cada usuário
        this.usuarioSelecionadoList.forEach(usuario => {
          usuario.valorDividido = Number(valorPorParte.toFixed(2));
        });

      }
    }else{
      // Atualiza o valor de cada usuário
      this.usuarioSelecionadoList.forEach(usuario => {
        // @ts-ignore
        usuario.valorDividido = null;
      });
    }
  }

  validarDivisaoDespesa(): string {
    const tolerancia = 0.09; // Tolerância
    // @ts-ignore
    let valorTotalDespesa: number = parseFloat(this.despesaTemp.valor.toFixed(2));
    let valorTotalDeCotas: number = 0;
    let msgErro: string = '';

    this.usuarioSelecionadoList.forEach(usuario => {
      valorTotalDeCotas += usuario.valorDividido;
    });

    valorTotalDeCotas = parseFloat(valorTotalDeCotas.toFixed(2));

    if (this.isDividirDespesa && this.isValid(this.despesaTemp.valor) && !(Math.abs(valorTotalDespesa - valorTotalDeCotas) <= tolerancia)) {
      msgErro = 'A soma de todas as cotas deve ser igual ao VALOR TOTAL DESPESA';
    }

    return this.msgErroDivisaoDespesas = msgErro;
  }

  resetDivisao() {
    this.isDividirIgualmente = false;

    // Zera os valores de todos os usuários
    this.usuarioSelecionadoList.forEach(usuario => {
      // @ts-ignore
      usuario.valorDividido = null;
    });
  }

  retornaColunaValor(registro: Despesa) {
    if(registro.valorDividido){
      return registro.valorDividido;
    }else {
      return registro.valor;
    }
  }
}
