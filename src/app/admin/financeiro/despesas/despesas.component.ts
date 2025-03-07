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
import {
  InstituicaoFinanceiraUsuarioService
} from "../../../../services/financeiro/instituicao-financeira-usuario.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {
  ModalSelecaoUsuarioComponent
} from "../../modais-genericas/modal-selecao-usuario/modal-selecao-usuario.component";
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

  ref: DynamicDialogRef | undefined;

  usuarioLogadoObservable: Observable<Usuario | null> = new Observable<Usuario | null>();
  usuarioSelecionadoList: Usuario[] = [];
  usuarioLogado: Usuario | undefined;

  valorOriginal: number | undefined | null;
  isDividirIgualmente: boolean = false;



  ngOnInit() {
    this.getCompeteciaSelecionada(false);

    this.breadcrumbItens = [
      {icon: 'pi pi-home', routerLink: '/admin'},
      {label:'Financeiro'},
      {label: 'Gerenciar Despesas'},
      {label: 'Competência Atual'},
      {label: this.competenciaSelecionadaParaPesquisa.value}
    ];

    //this.despesasList = data.despesasList;

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
    const mesAtual = new Date().getMonth(); // Retorna de 0 (Janeiro) a 11 (Dezembro)

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

    console.log(this.competenciasList);

  }

  aplicarFiltroPadrao($event?: Event) {
    if (!this.exibirOutrasCompetencias && this.competenciaSelecionadaParaPesquisa) {
      this.dt.filter(this.competenciaSelecionadaParaPesquisa.key, 'competencia', 'contains');
    } else {
      this.dt.clear(); // Remove o filtro caso esteja exibindo todas as competências
      this.dt.filter(this.competenciaSelecionadaParaPesquisa.key, 'competencia', 'contains');
    }
  }

  fecharModalPesquisa() {
    this.limpaCamposFormPesquisa();
    this.exibirDialogPesquisa = false;
  }

  limpaCamposFormPesquisa(){

  }

  pesquisar() {
  }

  abrirModalDespesa(despesaGrid: Despesa | null) {
    this.prefixoModal = (despesaGrid ? "Editar" : "Cadastrar") + " Despesa";
    this.despesa = despesaGrid ? despesaGrid : new Despesa();
    this.despesaTemp = { ...this.despesa }; // Cria uma cópia para o objeto temporário
    this.isSubmetido = false;
    this.exibirDialogCadastroDespesa = true;

    this.filtrarCategoriasPorTipo("DESPESA");
    //this.parcelaSelecionada = this.parcelasList[0];
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

      // @ts-ignore
      this.despesaTemp.dtVencimento = new Date(despesaGrid.dtVencimento);

      this.instituicaoFinanceiraUsuarioSelecionada = this.instituicoesFinanceirasUsuarioList.find(item => item.id === despesaGrid.instituicaoFinanceiraUsuarioId);

      this.existePrestacaoSelecionada = this.existePrestacaoList[
        EnumService.getPosicaoEnumPorKey(
          despesaGrid.categoriaRegistroFinanceiro,
          this.categoriaRegistroFinanceiroList
        )
      ];

      // @ts-ignore
      if(this.isValid(despesaGrid.qtdParcela) && despesaGrid.qtdParcela > 1){
        this.atualizarExistePrestacaoSelecionada(this.existePrestacaoList[0]);
        // @ts-ignore
        this.parcelaSelecionada = this.parcelasList[despesaGrid.qtdParcela - 2];
      }else{
        this.atualizarExistePrestacaoSelecionada(this.existePrestacaoList[1]);
      }

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
      if(this.despesa.id === null){
        this.inserir("DESPESA");
      }else{
        this.editar("DESPESA");
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

    if(this.isValid(dtVencimento)) {
      this.despesaTemp.dtVencimento = this.formatarDataParaEnvio(dtVencimento);
    }

    if (!this.despesaTemp.usuariosResponsaveis) {
      this.despesaTemp.usuariosResponsaveis = [];
    }

    if (this.usuarioLogado) {
      this.despesaTemp.usuariosResponsaveis.push(this.usuarioLogado);
    }

    if(this.usuarioSelecionadoList){
      for (let usuario of this.usuarioSelecionadoList) {
          this.despesaTemp.usuariosResponsaveis.push(usuario);
      }
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

    let dtVencimentoAux = this.despesaTemp.dtVencimento;

    this.despesaTemp.usuariosResponsaveis = [];

    this.despesaTemp.usuariosResponsaveis = this.usuarioSelecionadoList;

    if (this.usuarioLogado) {
      this.despesaTemp.usuariosResponsaveis.push(this.usuarioLogado);
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

      return `${dia}/${mes}/${ano}`;
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

  exibirModalUsuarios() {

    this.valorOriginal = this.despesaTemp.valor;

    if (this.isDividirDespesa){
      this.ref = this.dialogService.open(ModalSelecaoUsuarioComponent, {
        header: 'Selecione um usuário para dividir a despesa',
        width: '100%%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
      });

      this.ref.onClose.subscribe((usuarioSelecionadoList: Usuario[]) => {
        this.usuarioSelecionadoList = usuarioSelecionadoList;
      });
    }else{
      this.usuarioSelecionadoList = [];
      this.despesaTemp.usuariosResponsaveis = [];
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
    let valor: number =  this.despesasList.reduce((total, registro) => total + (registro.valor || 0), 0);

    if(valor !== null){
      return valor;
    }

    return 0;

  }

  calcularTotalAPagar(): number {
    let valor: number = this.despesasList.filter(
        registro =>
        registro.tipoRegistroFinanceiro === 'DESPESA' && // Filtra apenas DESPESAS
        registro.statusPagamento === 'NAO' // Filtra apenas pagamentos com status "SIM"
      ).reduce(
        (total, registro) => total + (registro.valor || 0), 0
      );

    if(valor !== null){
      return valor;
    }

    return 0;
  }

  calcularTotalPago(): number {
    let valor: number = this.despesasList.filter(
      registro =>
        registro.tipoRegistroFinanceiro === 'DESPESA' && // Filtra apenas DESPESAS
        registro.statusPagamento === 'SIM' // Filtra apenas pagamentos com status "SIM"
    ).reduce(
      (total, registro) => total + (registro.valor || 0), 0
    );

    if(valor !== null){
      return valor;
    }

    return 0;
  }

  setExibirOutrasCompetencias() {
    if (this.exibirOutrasCompetencias) {
      this.getCompeteciaSelecionada(false);
      this.dt.clear(); // Remove o filtro de competência
    } else {
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
    let totalDividido = this.usuarioSelecionadoList
      .filter(usuario => parseFloat(usuario.valorDividido) > 0) // Filtra apenas valores positivos
      .reduce((acc, usuario) => acc + parseFloat(usuario.valorDividido), 0);

    // Atualiza o valor da despesa para refletir o restante
    // @ts-ignore
    this.despesaTemp.valor = this.valorOriginal - totalDividido;
  }

  dividirIgualmente() {

    if (!this.despesaTemp.valor || this.despesaTemp.valor <= 0) {
      this.resetDivisao(); // Se o valor for apagado, reinicia os campos
      return;
    }

    if (this.isDividirIgualmente) {
      let totalParticipantes = this.usuarioSelecionadoList.length + 1; // Usuários + o próprio campo despesaTemp.valor

      if (totalParticipantes > 0) {

        // @ts-ignore
        let valorPorParte = this.despesaTemp.valor / totalParticipantes; // Divide entre todos os envolvidos

        // Atualiza o valor de cada usuário
        this.usuarioSelecionadoList.forEach(usuario => {
          usuario.valorDividido = String(parseFloat(valorPorParte.toFixed(2)));
        });

        // Atualiza o campo despesaTemp.valor com a parte que cabe a ele
        this.despesaTemp.valor = valorPorParte;
      }
    }else{
      this.despesaTemp.valor = null;

      // Atualiza o valor de cada usuário
      this.usuarioSelecionadoList.forEach(usuario => {
        // @ts-ignore
        usuario.valorDividido = null;
      });
    }
  }

  // Método para zerar a divisão e recomeçar
  resetDivisao() {
    this.isDividirIgualmente = false;
    this.despesaTemp.valor = null;
    this.valorOriginal = 0; // Zera o valor inicial

    // Zera os valores de todos os usuários
    this.usuarioSelecionadoList.forEach(usuario => {
      // @ts-ignore
      usuario.valorDividido = null;
    });
  }

}
