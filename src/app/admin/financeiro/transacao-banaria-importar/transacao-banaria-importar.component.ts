import {Component} from '@angular/core';
import {MenuItem, MessageService, PrimeNGConfig} from "primeng/api";
import {InstituicaoFinanceiraUsuario} from "../../../../models/instituicao-financeira-usuario.model";
import {
  InstituicaoFinanceiraUsuarioService
} from "../../../../services/financeiro/instituicao-financeira-usuario.service";
import {FileBeforeUploadEvent, FileUploadEvent} from "primeng/fileupload";
import {HttpErrorResponse} from "@angular/common/http";
import {TransacaoBancariaService} from "../../../../services/financeiro/transacao-bancaria.service";

@Component({
  selector: 'app-transacao-banaria-importar',
  templateUrl: './transacao-banaria-importar.component.html',
  styleUrls: ['./transacao-banaria-importar.component.scss']
})
export class TransacaoBanariaImportarComponent {

  breadcrumbItens: MenuItem[] | undefined;

  uploadAPIUrl: string = "";

  isSubmetido: boolean = false;

  competenciasList: any[] = [];
  competenciaSelecionada: any;

  instituicoesFinanceirasUsuarioList: InstituicaoFinanceiraUsuario[] = [];
  instituicaoFinanceiraUsuarioSelecionada: InstituicaoFinanceiraUsuario | undefined;

  constructor(
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private instituicaoFinanceiraUsuarioService: InstituicaoFinanceiraUsuarioService,
    private transacaoBancariaService: TransacaoBancariaService
  ) {}

  ngOnInit() {
    this.getCompeteciaSelecionada(false);

    this.breadcrumbItens = [
      {icon: 'pi pi-home', routerLink: '/admin'},
      {label:'Financeiro'},
      {label: 'Transações Bancárias'},
      {label: 'Importar Extratos de Transações Bancárias'},
    ];

    this.getInstituicoesFinanceirasUsuario();

    this.uploadAPIUrl = this.transacaoBancariaService.getUrlServicoUploadTransacaoBancaria();

  }

  onBeforeUpload(event: FileBeforeUploadEvent) {

    if (this.competenciaSelecionada == null || this.competenciaSelecionada == "") {
      this.messageService.add({severity: 'error', summary: 'Erro Upload', detail: 'Competencia deve ser selecionada.'});
    }

    if (this.instituicaoFinanceiraUsuarioSelecionada == null) {
      this.messageService.add({severity: 'error', summary: 'Erro Upload', detail: 'Instituição Financeira deve ser selecionada.'});
    }

    event.formData.append('competencia', this.competenciaSelecionada.key);

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
        }
      }

      return competencia;
    });
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
}
