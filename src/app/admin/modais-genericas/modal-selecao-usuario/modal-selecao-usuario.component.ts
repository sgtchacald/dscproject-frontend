import {ChangeDetectorRef, Component} from '@angular/core';
import {Usuario} from "../../../../models/usuario.model";
import {UsuarioService} from "../../../../services/usuario/usuario.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-modal-selecao-usuario',
  templateUrl: './modal-selecao-usuario.component.html',
  styleUrls: ['./modal-selecao-usuario.component.scss']
})
export class ModalSelecaoUsuarioComponent {

  usuarioList: Usuario[] = [];

  usuarioLogado: Observable<Usuario | null> = new Observable<Usuario | null>();
  loginUsuarioLogado: string = "";

  constructor(
    private cdr: ChangeDetectorRef,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.usuarioLogado = this.usuarioService.retornaUsuario();
    this.usuarioLogado.subscribe(usuario => {
      if (usuario) {
        this.loginUsuarioLogado = usuario.login;
      }
    });

    this.atualizarTabela(true);

  }

  atualizarTabela(consumirAPI: boolean) {
    if(consumirAPI){
      this.usuarioService.buscarTodos().subscribe(instituicaoList => {
        console.log(this.loginUsuarioLogado);
        this.usuarioList = instituicaoList.filter(usuario => usuario.login !== this.loginUsuarioLogado);
      });
    }else{
      // Cria uma nova referência para forçar a atualização da tabela
      this.usuarioList = [...this.usuarioList.filter(usuario => usuario.login !== this.loginUsuarioLogado)];
    }

    this.cdr.detectChanges();
  }

  getUsuariosSelecionados() {
    console.log("selecionou o usuario")
  }
}
