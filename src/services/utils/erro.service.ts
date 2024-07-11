import { Injectable } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ErroService {
  constructor() { }

  extrairErros(httpErrorResponse: HttpErrorResponse): any {
    const erroAPI = httpErrorResponse.error;

    // Se a resposta não contém o objeto de erro esperado, retorne uma mensagem genérica
    if (!erroAPI || !erroAPI.errors) {
      return null;
    }

    // Extraia as mensagens de erro do objeto
    const mensagensErro: string[] = erroAPI.errors.map(erroAPI.errors.mensagem);

    console.log(mensagensErro)

    // Retorne as mensagens de erro
    return mensagensErro;
  }

  retornaErroStatusCode(error: HttpErrorResponse): any {
    let retorno: String = "";

    if (error.status) {
      switch (error.status) {
        case 400:
          retorno = error.status + ' - Erro de validação.';
          break;
        case 500:
          retorno = error.status + ' - Erro interno do servidor.';
          break;
        case 504:
          retorno = error.status + ' - O servidor está desconectado.';
          break;
        default:
          retorno = error.status + ' - Erro desconhecido.';
      }

      if(error.error.message){
        retorno = retorno = error.error.message;
      }

    }

    return retorno;
  }

}
