import {Component, ViewChild} from '@angular/core';
import {MenuItem} from "primeng/api";
import {RegistroFinanceiro} from "../../../../models/registro-financeiro.model";
import data from "../../../../assets/mock/db.json";
import {EnumService} from "../../../../services/utils/enum.service";

@Component({
  selector: 'app-registros-financeiros',
  templateUrl: './registros-financeiros.component.html',
  styleUrls: ['./registros-financeiros.component.scss']
})
export class RegistrosFinanceirosComponent {

  constructor(
    private enumService: EnumService,
  ) {}

  @ViewChild('dt') dt: any;
  protected readonly EnumService = EnumService;

  breadcrumbItens: MenuItem[] | undefined;
  registrosFinanceirosSelecionadosList: RegistroFinanceiro[] = [];
  registrosFinanceirosList: RegistroFinanceiro[] = [];
  registroFinanceiro: RegistroFinanceiro = new RegistroFinanceiro();
  loading: boolean = true;
  exibirDialogPesquisa: boolean = true;

  registroFinanceiroTemp: {} = new RegistroFinanceiro();
  isSubmetido: boolean = false;
  exibirDialogCadastro: boolean = false;
  prefixoModal: string | undefined = "";

  tipoRegistroFinanceiroList: any = [];
  tipoRegistroFinanceiroSelecionado: any = null;

  categoriaRegistroFinanceiroList:  any = [];
  categoriaRegistroFinanceiroSelecionado: any = null;

  diasList: { name: string, value: number }[] = [];
  diaSelecionado: number | null = null;

  parcelasList: { name: string, value: number }[] = [];
  parcelaSelecionada: number | null = null;

  statusPagamentoList:  any = [];
  statusPagamentoSelecionado: any = null;

  ngOnInit() {
    this.breadcrumbItens = [
      {icon: 'pi pi-home', routerLink: '/admin'},
      {label:'Financeiro'},
      {label: 'Gerenciar Registros Financeiros'}
    ];

    this.registrosFinanceirosList = data.registrosFinanceirosList;
    this.loading = false;

    this.tipoRegistroFinanceiroList = EnumService.getTipoRegistroFinanceiro();
    //this.tipoRegistroFinanceiroSelecionado = this.tipoRegistroFinanceiroList[1];

    // Gerar a lista de dias de 1 a 31
    for (let i = 1; i <= 31; i++) {
      this.diasList.push({ name: i.toString(), value: i });
    }

    // Gerar a lista de dias de 1 a 31
    for (let i = 1; i <= 360; i++) {
      this.parcelasList.push({ name: i.toString(), value: i });
    }

    this.statusPagamentoList = EnumService.getStatusPagamento();

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

  abrirModal(registroFinanceiroGrid: RegistroFinanceiro | null) {
    this.prefixoModal = registroFinanceiroGrid ? "Editar" : "Cadastrar";
    this.registroFinanceiro = registroFinanceiroGrid ? registroFinanceiroGrid : new RegistroFinanceiro();
    this.registroFinanceiroTemp = { ...this.registroFinanceiro }; // Cria uma cópia para o objeto temporário
    this.isSubmetido = false;
    this.exibirDialogCadastro = true;
  }

  fecharModal() {
    this.limpaCamposForm();
    this.exibirDialogCadastro = false;
    this.isSubmetido = false;
  }

  salvar() {

  }

  limpaCamposForm(){
    this.registroFinanceiro = new RegistroFinanceiro();
    //this.tipoInstituicaoFinanceiraSelecionada = undefined;
  }

  filtrarCategoriasPorTipo(tipo: string) {
    console.log('Tipo selecionado:', tipo);

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
}
