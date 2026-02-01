import {Component} from '@angular/core';
import {MenuItem, MessageService, PrimeNGConfig} from "primeng/api";
import {InstituicaoFinanceiraUsuario} from "../../../../models/instituicao-financeira-usuario.model";
import {
  InstituicaoFinanceiraUsuarioService
} from "../../../../services/financeiro/instituicao-financeira-usuario.service";
import {FileBeforeUploadEvent, FileUploadEvent} from "primeng/fileupload";
import {DespesaService} from 'src/services/financeiro/despesa.service';
import {HttpErrorResponse} from '@angular/common/http';
import {EnumService} from "../../../../services/utils/enum.service";

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-despesas-importar',
  templateUrl: './despesas-importar.component.html',
  styleUrls: ['./despesas-importar.component.scss']
})

export class DespesasImportarComponent {

  breadcrumbItens: MenuItem[] | undefined;

  uploadAPIUrl: string = "";

  isSubmetido: boolean = false;

  competenciaSelecionada: any;

  anosCompetenciaList: any = [];
  anoCompetenciaSelecionada: any;

  mesesCompetenciaList: any = [];
  mesCompetenciaSelecionada: any;

  dtVencimento: string | undefined | null | Date;

  instituicoesFinanceirasUsuarioList: InstituicaoFinanceiraUsuario[] = [];
  instituicaoFinanceiraUsuarioSelecionada: InstituicaoFinanceiraUsuario | undefined;

  constructor(
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private instituicaoFinanceiraUsuarioService: InstituicaoFinanceiraUsuarioService,
    private despesaService: DespesaService
  ) {}

  ngOnInit() {
    this.getCompeteciaSelecionada(true);

    this.breadcrumbItens = [
      {icon: 'pi pi-home', routerLink: '/admin'},
      {label:'Financeiro'},
      {label: 'Despesa'},
      {label: 'Importar Despesas'},
      {label: 'Competência Atual'},
      {label: this.getCompeteciaSelecionada(true).value}
    ];

    this.getInstituicoesFinanceirasUsuario();

    this.uploadAPIUrl = this.despesaService.getUrlServicoUploadDespesa();

  }

  onBeforeUpload(event: FileBeforeUploadEvent) {

    if (this.competenciaSelecionada == null ||  this.competenciaSelecionada == undefined || this.competenciaSelecionada == "") {
      this.messageService.add({severity: 'error', summary: 'Erro Upload', detail: 'Competencia deve ser selecionada.'});
    }

    if(!(this.dtVencimento !== null && this.dtVencimento !== undefined && !(typeof this.dtVencimento === 'string' && this.dtVencimento.trim() === ""))) {
      this.messageService.add({severity: 'error', summary: 'Erro Upload', detail: 'Data Vencimento deve ser selecionada.'});
    }

    if (this.instituicaoFinanceiraUsuarioSelecionada == null ||  this.instituicaoFinanceiraUsuarioSelecionada == undefined) {
      this.messageService.add({severity: 'error', summary: 'Erro Upload', detail: 'Instituição Financeira deve ser selecionada.'});
    }

    event.formData.append('dtVencimento', JSON.stringify(this.dtVencimento));

    event.formData.append('competencia', this.anoCompetenciaSelecionada.key + "-" + this.mesCompetenciaSelecionada);

    // @ts-ignore
    event.formData.append('bancoCodigo', this.instituicaoFinanceiraUsuarioSelecionada?.instituicaoFinanceira?.codigo);

  }

  onError(event: any): void {

    let errorMessage = 'Ocorreu um erro desconhecido durante o upload.';

    // O 'event.error' deve ser um HttpErrorResponse neste cenário
    if (event.error instanceof HttpErrorResponse) {
      const httpError = event.error;

      console.log(httpError);

      // Tenta parsear o corpo do erro. O backend deve enviar um JSON.
      let errorBody: any = httpError.error.message;

      // Se o backend enviar uma string que é um JSON, tentar parsear
      if (typeof errorBody === 'string') {
        try {
          errorMessage = errorBody;
        } catch (e) {
          errorMessage = 'Ocorreu um erro desconhecido durante o upload.';
        }
      }
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Erro no Upload',
      detail: errorMessage
    });
  }

  onUpload(event: FileUploadEvent) {
    this.messageService.add({severity: 'success', summary: 'Upload', detail: 'Arquivo Importado com sucesso!'});
  }

  getFileExtension(fileName: string): string {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
  }

  getInstituicoesFinanceirasUsuario() {
    this.instituicaoFinanceiraUsuarioService.buscarTodos().subscribe(instFinUsu => {
      if(instFinUsu){
        this.instituicoesFinanceirasUsuarioList = instFinUsu;
      }
    });
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
        if (indPreencheObjeto) {
          this.competenciaSelecionada = competencia;
          this.anoCompetenciaSelecionada = competenciaAnoSelecionado;
          this.mesCompetenciaSelecionada = competenciaMesSelecionado;
        }
        return competencia; // Retorna a competência atual
      }

      return null;
    }).find(comp => comp !== null);

      // Define a competência do mês atual como selecionada
      if(indPreencheObjeto){
        this.competenciaSelecionada = competenciaAtual;
      }

      return this.competenciaSelecionada;

  }

  private parseServerError(response: any): string {
    try {
      const parsed = JSON.parse(response);
      console.log(parsed);
      console.log(parsed.message);
      return parsed.message || 'Erro desconhecido no servidor.';
    } catch {
      return 'Erro inesperado no servidor. Verifique o arquivo ou tente novamente.';
    }
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
