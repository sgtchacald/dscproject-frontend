import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenService} from "../usuario/token.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {InstituicaoFinanceira} from "../../models/instituicao-financeira.model";

@Injectable({
  providedIn: 'root'
})
export class InstituicaoFinanceiraService {

  private apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) {}

  buscarTodos(){
    return this.httpClient.get<InstituicaoFinanceira[]>(this.apiUrl + '/instituicoes-financeiras');
  }

  cadastrar(instituicaoFinanceira : InstituicaoFinanceira){
    return this.httpClient.post(this.apiUrl + '/instituicoes-financeiras/inserir', instituicaoFinanceira);
  }

  editar(instituicaoFinanceira : InstituicaoFinanceira){
    const id = instituicaoFinanceira.id;
    return this.httpClient.put(this.apiUrl + `/instituicoes-financeiras/editar/${id}`, instituicaoFinanceira);
  }

  excluir(instituicaoFinanceira: InstituicaoFinanceira) {
    const id = instituicaoFinanceira.id;
    return this.httpClient.delete(this.apiUrl + `/instituicoes-financeiras/excluir/${id}`);
  }
}
