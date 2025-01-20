import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenService} from "../usuario/token.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {RegistroFinanceiro} from "../../models/registro-financeiro.model";

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

  excluir(instituicaoFinanceira: RegistroFinanceiro) {
    const id = instituicaoFinanceira.id;
    return this.httpClient.delete(this.apiUrl + `/registros-financeiros/excluir/${id}`);
  }

}
