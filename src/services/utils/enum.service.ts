import {Injectable} from '@angular/core';
import {T} from "@angular/cdk/keycodes";

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
      { key: 'RECEITA', value: 'Receita', color: "green", severity: 'success', icon: 'pi pi-dollar', icon2: 'pi pi-thumbs-up-fill' },
      { key: 'DESPESA', value: 'Despesa', color: "red",   severity: 'danger',  icon: 'pi pi-dollar', icon2: 'pi pi-thumbs-down-fill' }
    ];
  }

  static getCategoriaRegistroFinanceiro() {
    return [
      { key: 'SALARIO',                 value: 'Salário',      tipoRegistroFinanceiro: 'RECEITA', icon: 'fa-briefcase' },
      { key: 'SALARIO_DECIMO_TERCEIRO', value: '13º Salário',  tipoRegistroFinanceiro: 'RECEITA', icon: 'fa-gift' },
      { key: 'EXTRA',                   value: 'Extra',        tipoRegistroFinanceiro: 'RECEITA', icon: 'fa-plus-square' },
      { key: 'FERIAS',                  value: 'Férias',       tipoRegistroFinanceiro: 'RECEITA', icon: 'fa-umbrella' },
      { key: 'INVESTIMENTO',            value: 'Investimento', tipoRegistroFinanceiro: 'RECEITA', icon: 'fa-btc' },
      { key: 'MORADIA',                 value: 'Moradia',      tipoRegistroFinanceiro: 'DESPESA', icon: 'fa-home' },
      { key: 'ALIMENTACAO',             value: 'Alimentação',  tipoRegistroFinanceiro: 'DESPESA', icon: 'fa-cutlery' },
      { key: 'LAZER',                   value: 'Lazer',        tipoRegistroFinanceiro: 'DESPESA', icon: 'fa-gamepad' },
      { key: 'VESTUARIO',               value: 'Vestuário',    tipoRegistroFinanceiro: 'DESPESA', icon: 'fa-female' },
      { key: 'TRANSPORTE',              value: 'Transporte',   tipoRegistroFinanceiro: 'DESPESA', icon: 'fa-bus' },
      { key: 'CARRO',                   value: 'Carro',        tipoRegistroFinanceiro: 'DESPESA', icon: 'fa-car' },
      { key: 'SAUDE',                   value: 'Saúde',        tipoRegistroFinanceiro: 'DESPESA', icon: 'fa-heartbeat' },
      { key: 'EDUCACAO',                value: 'Educação',     tipoRegistroFinanceiro: 'DESPESA', icon: 'fa-graduation-cap' },
      { key: 'SERVICOS',                value: 'Serviços',     tipoRegistroFinanceiro: 'DESPESA', icon: 'fa-wrench' },
      { key: 'EMPRESTIMOS',             value: 'Empréstimos',  tipoRegistroFinanceiro: 'DESPESA', icon: 'fa-credit-card' },
    ];
  }

  static getStatusPagamento() {
    return [
      { key: 'SIM',           value: 'Sim',           severity: 'success'},
      { key: 'NAO',           value: 'Não',           severity: 'danger'},
      { key: 'NAO_SE_APLICA', value: 'Não se aplica', severity: 'info' }
    ];
  }

  static getStatusSimNao() :any {
    return [
      { key: 'SIM',           value: 'Sim',           severity: 'primary'},
      { key: 'NAO',           value: 'Não',           severity: 'danger'},
    ];
  }

  static getEnumPorKey(key: string | undefined | null, listaEnum: { key: string; value: string }[]) {
    let resultado: { key: string; value: string; } | null = null;

    listaEnum.forEach(obj => {
      if (obj.key === key && resultado === null) {
        resultado = obj;
      }
    });

    return resultado ? resultado : undefined;
  }

  static getPosicaoEnumPorKey(key: any | undefined | null, listaEnum: any[]){
    let posicaoEnum: number = 0;
    let resultado: any = null;

    // @ts-ignore
    listaEnum.forEach(obj => {
      posicaoEnum++;

      if (obj.key === key) {
        posicaoEnum--;
        resultado = posicaoEnum;
      }
    });

    return resultado;
  }

  static getLabelEnum(key: string | undefined | null, listaEnum: { key: string; value: string }[]) {
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

  /*static selecionarPorKey(key: string | undefined | null, obj: any): void {
    const item = this.getPorKey(key, obj);
    if (item) {
      console.log('item encontrado:', item);
    } else {
      console.warn('Nenhuma categoria encontrada com a key:', key);
    }
  }

  static getPorKey<T extends { key: string }>(key: string | undefined | null, list: T[]): T | undefined {
    return list.find(item => item.key === key);
  }*/

}
