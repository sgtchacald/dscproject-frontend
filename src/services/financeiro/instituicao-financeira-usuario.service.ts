import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {TokenService} from "../usuario/token.service";
import {Router} from "@angular/router";
import {InstituicaoFinanceiraUsuario} from "../../models/instituicao-financeira-usuario.model";

@Injectable({
  providedIn: 'root'
})
export class InstituicaoFinanceiraUsuarioService {

  private apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) {}

  buscarTodos(){
    return this.httpClient.get<InstituicaoFinanceiraUsuario[]>(this.apiUrl + '/instituicoes-financeiras-usuario');
  }

  cadastrar(instituicaoFinanceiraUsuario : InstituicaoFinanceiraUsuario){
    console.log(instituicaoFinanceiraUsuario);
    return this.httpClient.post(this.apiUrl + '/instituicoes-financeiras-usuario/inserir', instituicaoFinanceiraUsuario);
  }

  editar(instituicaoFinanceiraUsuario : InstituicaoFinanceiraUsuario){
    const id = instituicaoFinanceiraUsuario.id;
    return this.httpClient.put(this.apiUrl + `/instituicoes-financeiras-usuario/editar/${id}`, instituicaoFinanceiraUsuario);
  }

  excluir(instituicaoFinanceiraUsuario: InstituicaoFinanceiraUsuario) {
    const id = instituicaoFinanceiraUsuario.id;
    return this.httpClient.delete(this.apiUrl + `/instituicoes-financeiras-usuario/excluir/${id}`);
  }

}
