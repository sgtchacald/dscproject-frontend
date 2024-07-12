import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  getGeneros() {
    return [
      { key: 'FEMININO',  value: 'Feminino'  },
      { key: 'MASCULINO', value: 'Masculino' },
      { key: 'OUTRO',     value: 'Outro'     }
    ];
  }

  getTipoInstituicoesFinanceiras() {
    return [
      { key: 'BANCO',     value: 'Banco'  },
      { key: 'CORRETORA', value: 'Corretora' }
    ];
  }

  getEnumPorKey(key: string, listaEnum: { key: string; value: string; }[]) {
    let resultado: { key: string; value: string; } | null = null;

    listaEnum.forEach(obj => {
      if (obj.key === key && resultado === null) {
        resultado = obj;
      }
    });

    return resultado ? resultado : undefined;
  }

}
