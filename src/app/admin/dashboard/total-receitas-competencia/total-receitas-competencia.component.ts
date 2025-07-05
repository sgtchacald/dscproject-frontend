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

@Component({
  selector: 'app-total-receitas-competencia',
  templateUrl: './total-receitas-competencia.component.html',
  styleUrls: ['./total-receitas-competencia.component.scss']
})
export class TotalReceitasCompetenciaComponent {
    exibeSaldo: boolean = false;

  constructor(
    private utilService: UtilsService
  ) {}

  ngOnInit() {
    this.exibeSaldo = false;
  }

}
