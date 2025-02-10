import {ChangeDetectorRef, Component, EventEmitter, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {RegistroFinanceiro} from "../../../../models/registro-financeiro.model";
import data from "../../../../assets/mock/db.json";
import {EnumService} from "../../../../services/utils/enum.service";
import {InstituicaoFinanceiraUsuario} from "../../../../models/instituicao-financeira-usuario.model";
import {InstituicaoFinanceira} from "../../../../models/instituicao-financeira.model";
import {ErroService} from "../../../../services/utils/erro.service";
import {TranslateService} from "@ngx-translate/core";
import {HttpErrorResponse} from "@angular/common/http";
import {RegistroFinanceiroService} from "../../../../services/financeiro/registro-financeiro.service";
import {UtilsService} from "../../../../services/utils/utils.service";
import {
  InstituicaoFinanceiraUsuarioService
} from "../../../../services/financeiro/instituicao-financeira-usuario.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ModalSelecaoUsuarioComponent} from "../../modais-genericas/modal-selecao-usuario/modal-selecao-usuario.component";
import {Usuario} from "../../../../models/usuario.model";
import {Observable} from "rxjs";
import {UsuarioService} from "../../../../services/usuario/usuario.service";

@Component({
  selector: 'app-registros-financeiros',
  templateUrl: './registros-financeiros.component.html',
  styleUrls: ['./registros-financeiros.component.scss']
})
export class RegistrosFinanceirosComponent {

  constructor(
    private registroFinanceiroService: RegistroFinanceiroService,
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
  registrosFinanceirosSelecionadosList: RegistroFinanceiro[] = [];
  registrosFinanceirosList: RegistroFinanceiro[] = [];
  registroFinanceiro: RegistroFinanceiro = new RegistroFinanceiro();
  loading: boolean = true;
  exibirDialogPesquisa: boolean = true;
  existeErro: boolean = false;


  registroFinanceiroTemp: RegistroFinanceiro = new RegistroFinanceiro();
  isSubmetido: boolean = false;
  exibirQtdParcela: boolean = false;
  exibirDialogCadastroDespesa: boolean = false;
  prefixoModal: string | undefined = "";

  tipoRegistroFinanceiroList: any = [];

  categoriaRegistroFinanceiroList:  any = [];
  categoriaRegistroFinanceiroSelecionado: { key: string; value: string; icon: string } | undefined | null;

  parcelasList: { key: string, value: number }[] = [];
  parcelaSelecionada :{ key: string; value: number; } | undefined | null;

  statusPagamentoList:  any = [];
  statusPagamentoSelecionado: any = null;

  existePrestacaoList:  any = [];
  existePrestacaoSelecionado: any = null;

  instituicoesFinanceirasUsuarioList: InstituicaoFinanceiraUsuario[] = [];
  instituicaoFinanceiraUsuarioSelecionada: InstituicaoFinanceira | undefined | null;

  isDividirDespesa: boolean = false;

  ref: DynamicDialogRef | undefined;

  usuarioLogadoObservable: Observable<Usuario | null> = new Observable<Usuario | null>();
  usuarioSelecionadoList: Usuario[] = [];
  usuarioLogadoId: string | undefined;

  ngOnInit() {
    this.breadcrumbItens = [
      {icon: 'pi pi-home', routerLink: '/admin'},
      {label:'Financeiro'},
      {label: 'Gerenciar Registros Financeiros'}
    ];

    //this.registrosFinanceirosList = data.registrosFinanceirosList;

    this.loading = false;

    this.tipoRegistroFinanceiroList = EnumService.getTipoRegistroFinanceiro();

    // Gerar a lista de dias de 1 a 31
    for (let i = 2; i <= 36; i++) {
      this.parcelasList.push({ key: i.toString(), value: i });
    }

    this.statusPagamentoList = EnumService.getStatusSimNao();

    this.existePrestacaoList = EnumService.getStatusSimNao();

    this.exibirQtdParcela = false;

    this.getInstituicoesFinanceirasUsuario();

    this.usuarioLogadoObservable = this.usuarioService.retornaUsuario();
    this.usuarioLogadoObservable.subscribe(usuario => {
      if (usuario) {
        this.usuarioLogadoId = usuario.id;
      }
    });


    this.atualizarTabela(true);

  }

  aplicarFiltroPadrao($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    this.dt.filterGlobal(inputElement.value, "contains");
  }

  fecharModalPesquisa() {
    this.limpaCamposFormPesquisa();
    this.exibirDialogPesquisa = false;
  }

  limpaCamposFormPesquisa(){

  }

  pesquisar() {
  }

  abrirModalDespesa(registroFinanceiroGrid: RegistroFinanceiro | null) {
    this.prefixoModal = (registroFinanceiroGrid ? "Editar" : "Cadastrar") + " Despesa";
    this.registroFinanceiro = registroFinanceiroGrid ? registroFinanceiroGrid : new RegistroFinanceiro();
    this.registroFinanceiroTemp = { ...this.registroFinanceiro }; // Cria uma cópia para o objeto temporário
    this.isSubmetido = false;
    this.exibirDialogCadastroDespesa = true;

    this.filtrarCategoriasPorTipo("DESPESA");
    //this.parcelaSelecionada = this.parcelasList[0];
    this.statusPagamentoSelecionado = this.statusPagamentoList[1];
    this.existePrestacaoSelecionado = this.existePrestacaoList[1];

    if(registroFinanceiroGrid?.id){

      this.registroFinanceiroTemp.tipoRegistroFinanceiro = EnumService.getEnumPorKey(
        registroFinanceiroGrid.tipoRegistroFinanceiro, EnumService.getCategoriaRegistroFinanceiro()
      );

      this.statusPagamentoSelecionado = this.statusPagamentoList[
        EnumService.getPosicaoEnumPorKey(
          registroFinanceiroGrid.statusPagamento,
          this.statusPagamentoList
        )
      ];

      this.categoriaRegistroFinanceiroSelecionado = this.categoriaRegistroFinanceiroList[
        EnumService.getPosicaoEnumPorKey(
          registroFinanceiroGrid.categoriaRegistroFinanceiro,
          this.categoriaRegistroFinanceiroList
        )
      ];

      this.existePrestacaoSelecionado = this.existePrestacaoList[
        EnumService.getPosicaoEnumPorKey(
          registroFinanceiroGrid.categoriaRegistroFinanceiro,
          this.categoriaRegistroFinanceiroList
        )
      ];

      // @ts-ignore
      if(this.isValid(registroFinanceiroGrid.qtdParcela) && registroFinanceiroGrid.qtdParcela > 1){
        this.atualizarExistePrestacaoSelecionado(this.existePrestacaoList[0]);
        // @ts-ignore
        this.parcelaSelecionada = this.parcelasList[registroFinanceiroGrid.qtdParcela - 2];
      }else{
        this.atualizarExistePrestacaoSelecionado(this.existePrestacaoList[1]);
      }

    }else{
      this.limparCamposFormNovoRegistroFinanceiro();
    }
  }

  fecharModal() {
    this.limpaCamposForm();
    this.exibirDialogCadastroDespesa = false;
    this.isSubmetido = false;
  }

  limparCamposFormNovoRegistroFinanceiro() {
    this.registroFinanceiroTemp = new RegistroFinanceiro();
  }

  salvarDespesa() {
      if(this.registroFinanceiro.id === null){
        this.inserir("DESPESA");
      }else{
        this.editar("DESPESA");
      }
  }

  private inserir(tipoRegistroFinanceiro: string) {
    this.isSubmetido = true;

    this.registroFinanceiroTemp.tipoRegistroFinanceiro = tipoRegistroFinanceiro;
    this.registroFinanceiroTemp.categoriaRegistroFinanceiro = this.categoriaRegistroFinanceiroSelecionado?.key;
    this.registroFinanceiroTemp.instituicaoFinanceiraUsuarioId = this.instituicaoFinanceiraUsuarioSelecionada?.id;
    this.registroFinanceiroTemp.qtdParcela = this.parcelaSelecionada?.value;
    this.registroFinanceiroTemp.statusPagamento = this.statusPagamentoSelecionado?.key;

    //const dtLancamento: any = this.formatarDataHoraParaEnvio(new Date().toString());
    //this.registroFinanceiroTemp.dtCadastro = dtLancamento;

    const dtVencimento = this.registroFinanceiroTemp.dtVencimento;

    if(this.isValid(dtVencimento)) {

      /*let pDtVencimentoPDia = this.registroFinanceiroTemp.dtVencimento;
      let dia = null;
      if(this.isValid(pDtVencimentoPDia)){
        // @ts-ignore
        let data = new Date(pDtVencimentoPDia);
       dia = String(data.getDate()).padStart(2, '0');
      }

      this.registroFinanceiroTemp.diaVencimento = dia;*/

      this.registroFinanceiroTemp.dtVencimento = this.formatarDataParaEnvio(dtVencimento);
    }

    if (!this.registroFinanceiroTemp.usuariosResponsaveis) {
      this.registroFinanceiroTemp.usuariosResponsaveis = [];
    }

    this.registroFinanceiroTemp.usuariosResponsaveis.push(Number(this.usuarioLogadoId));

    if(this.usuarioSelecionadoList){
      for (let usuario of this.usuarioSelecionadoList) {
        this.registroFinanceiroTemp.usuariosResponsaveis.push(Number(usuario.id));
      }
    }

    if (
      this.isValid(this.categoriaRegistroFinanceiroSelecionado)
      && this.isValid(this.registroFinanceiroTemp.descricao)
      && this.isValid(this.registroFinanceiroTemp.valor)
      && this.isValid(this.registroFinanceiroTemp.statusPagamento)
    ) {
      this.registroFinanceiroService.cadastrar(this.registroFinanceiroTemp).subscribe(
        () => {
          // Atualiza o objeto original após sucesso
          this.registroFinanceiro = {...this.registroFinanceiroTemp};

          //Faz o Push no novo item para a tabela.
          this.registrosFinanceirosList.push(this.registroFinanceiroTemp);

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

    this.registroFinanceiroTemp.tipoRegistroFinanceiro = tipoRegistroFinanceiro;
    this.registroFinanceiroTemp.categoriaRegistroFinanceiro = this.categoriaRegistroFinanceiroSelecionado?.key;
    this.registroFinanceiroTemp.instituicaoFinanceiraUsuarioId = this.instituicaoFinanceiraUsuarioSelecionada?.id;

    this.registroFinanceiroTemp.qtdParcela = this.parcelaSelecionada?.value;
    this.registroFinanceiroTemp.statusPagamento = this.statusPagamentoSelecionado?.key;

    const dtVencimento = this.registroFinanceiroTemp.dtVencimento;
    if(this.isValid(dtVencimento)) {
      this.registroFinanceiroTemp.dtVencimento = this.formatarDataParaEnvio(dtVencimento);
    }

    // @ts-ignore
    if(this.existePrestacaoSelecionado.key === "NAO"){
      this.registroFinanceiroTemp.qtdParcela = null;
    }

    if (this.isValid(this.categoriaRegistroFinanceiroSelecionado)
      && this.isValid(this.registroFinanceiroTemp.descricao)
      && this.isValid(this.registroFinanceiroTemp.valor)
      && this.isValid(this.registroFinanceiroTemp.statusPagamento)
      && this.isValid(this.instituicaoFinanceiraUsuarioSelecionada)
    ) {
      this.registroFinanceiroService.editar(this.registroFinanceiroTemp).subscribe(
        () => {
          // Atualiza o objeto original após sucesso
          this.registroFinanceiro = { ...this.registroFinanceiroTemp };

          // Atualiza a lista de registros financeiros
          const index = this.registrosFinanceirosList.findIndex(item => item.id === this.registroFinanceiro.id);
          if (index !== -1) {
            this.registrosFinanceirosList[index] = { ...this.registroFinanceiro };
          }

          // Exibe mensagem de Sucesso
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: this.translate.instant('message.editadoSucesso')});
          this.fecharModal();
          this.atualizarTabela(false); // Atualiza a tabela após editar sem consultar a api
        },(error: any) => {
          erro = this.erroService.retornaErroStatusCode(error);
          if (erro !== "") {
            this.messageService.add({severity: 'error', summary: 'Erro',  detail: this.translate.instant('message.cadastradoSucesso') + " " + erro });
          }
        }
      );
    }
  }

  excluir(registroFinanceiroGrid: RegistroFinanceiro) {
    console.log("clicou");

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o item: <b>' + registroFinanceiroGrid.descricao + '</b>?',
      header: 'Confirmar Ação',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-primary mt-3",
      rejectButtonStyleClass: "p-button-danger mt-3 mr-3",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        this.registroFinanceiroService.excluir(registroFinanceiroGrid).subscribe(
          () => {
            const index = this.registrosFinanceirosList.findIndex(item => item.id === registroFinanceiroGrid.id);
            if (index !== -1) {
              this.registrosFinanceirosList.splice(index, 1);
              this.atualizarTabela(false); // Atualiza a tabela após excluir

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: this.utils.substituiVariaveis(this.translate.instant('message.excluidoSucessoCustom'), { registro: registroFinanceiroGrid.descricao })
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
        for (let item of this.registrosFinanceirosSelecionadosList) {
          this.registroFinanceiroService.excluir(item).subscribe(
            () => {
              const index = this.registrosFinanceirosList.findIndex(itemAExcluir => itemAExcluir.id === item.id);
              if (index !== -1) {
                this.registrosFinanceirosList.splice(index, 1);
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
      this.registroFinanceiroService.buscarTodos().subscribe(registrosList => {
        this.registrosFinanceirosList = registrosList;
        console.log(this.registrosFinanceirosList);
        this.loading = false;
      });
    }else{
      // Cria uma nova referência para forçar a atualização da tabela
      this.registrosFinanceirosList = [...this.registrosFinanceirosList];
      this.loading = false;
    }
    this.cdr.detectChanges();
  }

  limpaCamposForm(){
    this.registroFinanceiro = new RegistroFinanceiro();
    //this.tipoInstituicaoFinanceiraSelecionada = undefined;
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

  formatarDataParaEnvio(pData: string | undefined | null) {
    if (pData) {
      const data = new Date(pData);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();

      return `${dia}/${mes}/${ano}`;
    }
    return '';
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

  atualizarExistePrestacaoSelecionado(existePrestacaoSelecionado: any) {
    this.existePrestacaoSelecionado = existePrestacaoSelecionado;

    this.exibirQtdParcela = this.existePrestacaoSelecionado.key == "SIM";
  }

  getInstituicoesFinanceirasUsuario() {
      this.instituicaoFinanceiraUsuarioService.buscarTodos().subscribe(instFinUsu => {
        if(instFinUsu){
          this.instituicoesFinanceirasUsuarioList = instFinUsu;
        }
      });
  }

  exibirModalUsuarios() {
    if (
      Array.isArray(this.isDividirDespesa) &&
      this.isDividirDespesa.length === 1 &&
      this.isDividirDespesa[0] === "true"
    ){
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
    }

  }

  excluirDivisao(usuario: Usuario) {
    const index = this.usuarioSelecionadoList.findIndex(item => item.id === usuario.id);
    if (index !== -1) {
      this.registrosFinanceirosList.splice(index, 1);
      const elemento = document.getElementById("usuarioSelecionadoItem" + usuario.login);

      if (elemento) {
        this.renderer.removeChild(elemento.parentElement, elemento);
        console.log(this.registrosFinanceirosList);
        this.isDividirDespesa = !!this.registrosFinanceirosList.length;
      }
    }
  }

  calcularTotalGeral(): number {
    let valor: number =  this.registrosFinanceirosList.reduce((total, registro) => total + (registro.valor || 0), 0);

    if(valor !== null){
      return valor;
    }

    return 0;

  }

  calcularTotalAPagar(): number {
    let valor: number = this.registrosFinanceirosList.filter(
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
    let valor: number = this.registrosFinanceirosList.filter(
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
}
