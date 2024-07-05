import { TokenService } from './token.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
      private httpClient: HttpClient,
      private tokenService: TokenService,
      private router: Router,
  ) {
    if(tokenService.retornarToken() != ''){
      this.decodificaJWT();
    }
  }

  private apiUrl = environment.apiUrl;

  private usuarioSubject = new BehaviorSubject<Usuario|null>(null);

  private decodificaJWT(){
    const token = this.tokenService.retornarToken();
    const usuario = jwtDecode(token) as Usuario;
    this.usuarioSubject.next(usuario);
  }

  cadastrar(usuario : Usuario){
    return this.httpClient.post(this.apiUrl + '/usuarios/inserir-usuario-site', usuario);
  }

  verificaExisteUsuario(valor: string): Observable<any>{
    return this.httpClient.get<Object>(`${this.apiUrl}/usuarios/existe-usuario?valor=${valor}`);
  }

  retornaUsuario(){
    return this.usuarioSubject.asObservable();
  }

  salvaToken(token: string){
    this.tokenService.salvarToken(token);
    this.decodificaJWT();
  }

  logout(){
    this.tokenService.excluirToken();
    this.usuarioSubject.next(null);
  }

  estaLogado(){
    return this.tokenService.possuiToken();
  }

  autenticar(login: string, senha: string): Observable<HttpResponse<any>> {

    return this.httpClient.post(
      this.apiUrl+'/auth/login',
      {login: login, senha: senha},
      {observe: 'response'}
    ).pipe(
      tap((res) => {
        const authToken = res.headers.get('authorization') ?? '';
        this.salvaToken(authToken);
      })
    );
  }

  recuperarSenha(email: string) {
    console.log(this.apiUrl+'/login/esqueci-a-senha');
    return this.httpClient.post(this.apiUrl+'/auth/recuperar-senha', { email });
  }
}

