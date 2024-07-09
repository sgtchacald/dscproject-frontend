import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenService} from "../usuario/token.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {Usuario} from "../../models/usuario.model";
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

  cadastrar(instituicaoFinanceira : InstituicaoFinanceira){
    return this.httpClient.post(this.apiUrl + '/instituicao-financeira/inserir', instituicaoFinanceira);
  }



}
