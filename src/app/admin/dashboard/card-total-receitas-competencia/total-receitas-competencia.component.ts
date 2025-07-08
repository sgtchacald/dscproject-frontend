import {ChangeDetectorRef, Component, Renderer2} from '@angular/core';
import {DespesaService} from "../../../../services/financeiro/despesa.service";
import {ErroService} from "../../../../services/utils/erro.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {UtilsService} from "../../../../services/utils/utils.service";
import {
  InstituicaoFinanceiraUsuarioService
} from "../../../../services/financeiro/instituicao-financeira-usuario.service";
import {DialogService} from "primeng/dynamicdialog";
import {UsuarioService} from "../../../../services/usuario/usuario.service";
import {ReceitaService} from "../../../../services/financeiro/receita.service";

@Component({
  selector: 'app-card-total-receitas-competencia',
  templateUrl: './total-receitas-competencia.component.html',
  styleUrls: ['./total-receitas-competencia.component.scss']
})
export class TotalReceitasCompetenciaComponent {
    exibeSaldo: boolean = false;
    saldo: any = null;

  constructor(
    private utilService: UtilsService,
    private receitaService: ReceitaService,
    private erroService: ErroService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {this.exibeSaldo = false;
    this.saldo = this.receitaService.buscarTotalPorCompetencia(this.utilService.getCompeteciaAtual()).subscribe({
      // @ts-ignore
      next: (res: {valor: string}) => {
       this.saldo = res.valor;
      },
      error: (error: any) => {
        const erro: string = this.erroService.retornaErroStatusCode(error);
        if (erro) {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: erro });
        }
      }
    });
  }

}
