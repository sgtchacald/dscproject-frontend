import { Injectable } from '@angular/core';
import {CanActivate, Router} from "@angular/router";
import { Observable } from "rxjs";
import { AutenticacaoService } from "../services/usuario/autenticacao.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  implements  CanActivate {
  constructor(
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | boolean {
    if(this.autenticacaoService.verificarSeUsuarioEstaAutenticado()){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

}
