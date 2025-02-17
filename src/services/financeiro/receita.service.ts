import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {TokenService} from "../usuario/token.service";
import {Router} from "@angular/router";
import {Receita} from "../../models/receita.model";

@Injectable({
  providedIn: 'root'
})
export class ReceitaService {
  private apiUrl = environment.apiUrl;


  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) {}

  cadastrar(receita : Receita){
    return this.httpClient.post(this.apiUrl + '/receita/inserir', receita);
  }

  editar(receita: Receita) {
    const id = receita.id;
    return this.httpClient.put(this.apiUrl + `/receita/editar/${id}`, receita);
  }

  excluir(receita: Receita) {
    const id = receita.id;
    return this.httpClient.delete(this.apiUrl + `/receita/excluir/${id}`);
  }

  buscarTodos() {
    return this.httpClient.get<Receita[]>(this.apiUrl + '/receita');
  }
}
