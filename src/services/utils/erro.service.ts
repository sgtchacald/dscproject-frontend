import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErroService {
  constructor() {}

  extrairErros(httpErrorResponse: HttpErrorResponse): string[] | null {
    if (httpErrorResponse.status === 200) {
      return null;
    }

    const erroAPI = httpErrorResponse.error;

    if (!erroAPI || !Array.isArray(erroAPI.errors)) {
      return null;
    }

    const mensagensErro: string[] = erroAPI.errors.map((e: any) => e.mensagem || 'Erro desconhecido.');
    return mensagensErro;
  }

  retornaErroStatusCode(error: HttpErrorResponse): string {
    if (error.status === 200) {
      return '';
    }

    let retorno = '';

    switch (error.status) {
      case 400:
        retorno = '400 - Erro de validação.';
        break;
      case 403:
        retorno = '403 - Não autorizado.';
        break;
      case 500:
        retorno = '500 - Erro interno do servidor.';
        break;
      case 504:
        retorno = '504 - O servidor está desconectado.';
        break;
      default:
        retorno = `${error.status} - Erro desconhecido.`;
    }

    if (error.error?.message) {
      retorno = error.error.message;
    }

    return retorno;
  }
}
