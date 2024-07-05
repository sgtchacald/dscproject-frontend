import { Injectable } from '@angular/core';

const KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  retornarToken(){
    return localStorage.getItem(KEY) ?? '';
  }

  salvarToken(token :string){
    localStorage.setItem(KEY, token);
  }

  excluirToken(){
    console.log('Excluir Token ativado');
    localStorage.removeItem(KEY);
  }

  possuiToken(){
    return (!this.retornarToken()) ? false : true;
  }

}
