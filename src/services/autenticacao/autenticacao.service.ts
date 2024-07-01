import { UsuarioService } from './../usuario/usuario.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {TokenService} from "./token.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  constructor(
    private httpClient: HttpClient,
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  private apiUrl = environment.apiUrl;

  autenticar(login: string, senha: string): Observable<HttpResponse<any>> {
    return this.httpClient.post(this.apiUrl + '/api/login', {
      login: login,
      senha: senha,
      },
      { observe : 'response'}
    ).pipe(
      tap(
        (response) => {
          const authToken = response.headers.get('x-access-token') ?? '';
          this.usuarioService.salvaToken(authToken);
        }
      )
    );
  }

  verificarSeUsuarioEstaAutenticado(){
    return this.tokenService.possuiToken();
  }

  sair(){
    this.tokenService.excluirToken();
    this.router.navigate(['/login']);
  }
}
