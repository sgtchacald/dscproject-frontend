import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  substituiVariaveis(message: string, variables: { [key: string]: any }): string {
    return message.replace(/{(\w+)}/g, (_, key) => variables[key] || '');
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

  getCompeteciaAtual() {
    let anoCorrente = new Date().getFullYear();
    let mesAtual = new Date().getMonth();
    let competenciaAtual :string = `${anoCorrente}-${mesAtual.toString().padStart(2, '0')}`;

    return competenciaAtual;
  }

}
