import { Component } from '@angular/core';
import {UtilsService} from "../../../../services/utils/utils.service";

@Component({
  selector: 'app-total-despesas-competencia',
  templateUrl: './total-despesas-competencia.component.html',
  styleUrls: ['./total-despesas-competencia.component.scss']
})
export class TotalDespesasCompetenciaComponent {
  exibeSaldo: boolean = false;

  constructor(
    private utilService: UtilsService
  ) {}

  ngOnInit() {
    this.exibeSaldo = false;
  }

  exibirSaldo(){
    console.log('exibirSaldo' + this.exibeSaldo);
    return this.utilService.alternaValor(this.exibeSaldo);
  }
}
