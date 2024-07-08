import { Component } from '@angular/core';
import {filter, map, Observable, Subject} from "rxjs";
import {AutenticacaoService} from "../../../services/usuario/autenticacao.service";
import {NbMenuService, NbSidebarService} from "@nebular/theme";
import {LayoutService} from "../../../utils/layout.service";
import {UsuarioService} from "../../../services/usuario/usuario.service";
import {Usuario} from "../../../models/usuario.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private usuarioService: UsuarioService,
    private nbMenuService: NbMenuService,
    private layoutService: LayoutService,
    private sidebarService: NbSidebarService,
    private autenticacaoService: AutenticacaoService
  ) {
  }

  private destroy$: Subject<void> = new Subject<void>();

  userPictureOnly: boolean = false;
  usuario: Observable<Usuario | null> = new Observable<Usuario | null>();

  userMenu = [{ title: 'Sair' } ];

  ngOnInit() {

    this.usuario = this.usuarioService.retornaUsuario();

    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
        map(({ item: { title } }) => title),
      ).subscribe(title=>
      {
        this.autenticacaoService.sair();
      }
    );
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-menu');
    this.layoutService.changeLayoutSize();

    return false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
