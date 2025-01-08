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

    this.categoriaRegistroFinanceiroList = EnumService.getCategoriaRegistroFinanceiro();

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


}
