import { Component } from '@angular/core';
import {UtilsService} from "../../../../services/utils/utils.service";
import {ReceitaService} from "../../../../services/financeiro/receita.service";
import {ErroService} from "../../../../services/utils/erro.service";
import {MessageService} from "primeng/api";
import {DespesaService} from "../../../../services/financeiro/despesa.service";

@Component({
  selector: 'app-card-total-despesas-competencia',
  templateUrl: './total-despesas-competencia.component.html',
  styleUrls: ['./total-despesas-competencia.component.scss']
})
export class TotalDespesasCompetenciaComponent {
  exibeSaldo: boolean = false;
  saldo: any = null;

  constructor(
    private utilService: UtilsService,
    private despesaService: DespesaService,
    private erroService: ErroService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {this.exibeSaldo = false;
    this.saldo = this.despesaService.buscarTotalPorCompetencia(this.utilService.getCompeteciaAtual()).subscribe({
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
