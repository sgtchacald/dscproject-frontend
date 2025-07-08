import { Component } from '@angular/core';
import {UtilsService} from "../../../../services/utils/utils.service";
import {DespesaService} from "../../../../services/financeiro/despesa.service";
import {ErroService} from "../../../../services/utils/erro.service";
import {MessageService} from "primeng/api";
import {TransacaoBancariaService} from "../../../../services/financeiro/transacao-bancaria.service";

@Component({
  selector: 'app-card-total-saldo-mensal-competencia',
  templateUrl: './total-saldo-mensal-competencia.component.html',
  styleUrls: ['./total-saldo-mensal-competencia.component.scss']
})
export class TotalSaldoMensalCompetenciaComponent {
  exibeSaldo: boolean = false;
  saldo: any = null;

  constructor(
    private utilService: UtilsService,
    private transacaoBancariaService: TransacaoBancariaService,
    private erroService: ErroService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {this.exibeSaldo = false;
    this.transacaoBancariaService.buscarSaldoPorCompetencia(this.utilService.getCompeteciaAtual()).subscribe({
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
