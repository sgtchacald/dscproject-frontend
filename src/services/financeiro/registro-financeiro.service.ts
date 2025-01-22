import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenService} from "../usuario/token.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {RegistroFinanceiro} from "../../models/registro-financeiro.model";
import {InstituicaoFinanceira} from "../../models/instituicao-financeira.model";

@Injectable({
  providedIn: 'root'
})
export class RegistroFinanceiroService {

  private apiUrl = environment.apiUrl;


  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) {}

  cadastrar(registroFinanceiro : RegistroFinanceiro){
    return this.httpClient.post(this.apiUrl + '/registros-financeiros/inserir', registroFinanceiro);
  }

  editar(registroFinanceiro: RegistroFinanceiro) {
    const id = registroFinanceiro.id;
    return this.httpClient.put(this.apiUrl + `/registros-financeiros/editar/${id}`, registroFinanceiro);
  }

  excluir(registroFinanceiro: RegistroFinanceiro) {
    const id = registroFinanceiro.id;
    return this.httpClient.delete(this.apiUrl + `/registros-financeiros/excluir/${id}`);
  }

  buscarTodos() {
    return this.httpClient.get<RegistroFinanceiro[]>(this.apiUrl + '/registros-financeiros');
  }
}
