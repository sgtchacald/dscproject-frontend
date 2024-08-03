import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EnumService {

static getGeneros() {
    return [
      { key: 'FEMININO',  value: 'Feminino'  },
      { key: 'MASCULINO', value: 'Masculino' },
      { key: 'OUTRO',     value: 'Outro'     }
    ];
  }

  static getTipoInstituicoesFinanceiras() {
    return [
      { key: 'BANCO',     value: 'Banco'  },
      { key: 'CORRETORA', value: 'Corretora' }
    ];
  }

  static getTipoReceitaDespesa() {
    return [
      { key: 'BANCO',     value: 'Banco'     },
      { key: 'CORRETORA', value: 'Corretora' }
    ];
  }

  static getTipoRegistroFinanceiro() {
    return [
      { key: 'RECEITA', value: 'Receita', severity: 'success' },
      { key: 'DESPESA', value: 'Despesa', severity: 'danger' }
    ];
  }

  static getCategoriaReceitaDespesa() {
    return [
      { key: 'SALARIO',                 value: 'Salário',       tipoRegistroFinanceiro: 'RECEITA'},
      { key: 'SALARIO_DECIMO_TERCEIRO', value: '13º Salário',   tipoRegistroFinanceiro: 'RECEITA'},
      { key: 'EXTRA',                   value: 'Extra',         tipoRegistroFinanceiro: 'RECEITA'},
      { key: 'FERIAS',                  value: 'Férias',        tipoRegistroFinanceiro: 'RECEITA'},
      { key: 'INVESTIMENTO',            value: 'Investimento',  tipoRegistroFinanceiro: 'RECEITA'},
      { key: 'MORADIA',                 value: 'Moradia',       tipoRegistroFinanceiro: 'DESPESA'},
      { key: 'ALIMENTACAO',             value: 'Alimentação',   tipoRegistroFinanceiro: 'DESPESA'},
      { key: 'LAZER',                   value: 'Lazer',         tipoRegistroFinanceiro: 'DESPESA'},
      { key: 'VESTUARIO',               value: 'Vestuário',     tipoRegistroFinanceiro: 'DESPESA'},
      { key: 'TRANSPORTE',              value: 'Transporte',    tipoRegistroFinanceiro: 'DESPESA'},
      { key: 'CARRO',                   value: 'Carro',         tipoRegistroFinanceiro: 'DESPESA'},
      { key: 'SAUDE',                   value: 'Saúde',         tipoRegistroFinanceiro: 'DESPESA'},
      { key: 'EDUCACAO',                value: 'Educação',      tipoRegistroFinanceiro: 'DESPESA'},
      { key: 'SERVICOS',                value: 'Serviços',      tipoRegistroFinanceiro: 'DESPESA'},
      { key: 'EMPRESTIMOS',             value: 'Empréstimos',   tipoRegistroFinanceiro: 'DESPESA'},
    ];
  }

  static getStatusPagamento() {
    return [
      { key: 'SIM',           value: 'Sim',           severity: 'success'},
      { key: 'NAO',           value: 'Não',           severity: 'danger'},
      { key: 'NAO_SE_APLICA', value: 'Não se aplica', severity: 'info' }
    ];
  }

  static getEnumPorKey(key: string, listaEnum: { key: string; value: string; }[]) {
    let resultado: { key: string; value: string; } | null = null;

    listaEnum.forEach(obj => {
      if (obj.key === key && resultado === null) {
        resultado = obj;
      }
    });

    return resultado ? resultado : undefined;
  }

  static getLabelEnum(key: string, listaEnum: { key: string; value: string; }[]) {
    let resultado: string | null = null;

    listaEnum.forEach(obj => {
      if (obj.key === key && resultado === null) {
        resultado = obj.value;
      }
    });

    return resultado ? resultado : undefined;
  }

  static getSeveridadeEnum(key: string, listaEnum: { key: string; value: string; severity: string }[]) {
    let resultado: string | null = null;

    listaEnum.forEach(obj => {
      if (obj.key === key && resultado === null) {
        resultado = obj.severity;
      }
    });

    return resultado ? resultado : undefined;
  }

}
