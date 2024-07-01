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
}
