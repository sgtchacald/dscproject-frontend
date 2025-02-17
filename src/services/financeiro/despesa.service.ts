import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenService} from "../usuario/token.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {Despesa} from "../../models/despesa.model";

@Injectable({
  providedIn: 'root'
})
export class DespesaService {

  private apiUrl = environment.apiUrl;


  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) {}

  cadastrar(despesa : Despesa){
    return this.httpClient.post(this.apiUrl + '/registros-financeiros/inserir', despesa);
  }

  editar(despesa: Despesa) {
    const id = despesa.id;
    return this.httpClient.put(this.apiUrl + `/registros-financeiros/editar/${id}`, despesa);
  }

  excluir(despesa: Despesa) {
    const id = despesa.id;
    return this.httpClient.delete(this.apiUrl + `/registros-financeiros/excluir/${id}`);
  }

  buscarTodos() {
    return this.httpClient.get<Despesa[]>(this.apiUrl + '/registros-financeiros');
  }
}
