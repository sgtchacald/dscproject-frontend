import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {Usuario} from "../../../../models/usuario.model";
import {UsuarioService} from "../../../../services/usuario/usuario.service";
import {Observable} from "rxjs";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-modal-selecao-usuario',
  templateUrl: './modal-selecao-usuario.component.html',
  styleUrls: ['./modal-selecao-usuario.component.scss']
})
export class ModalSelecaoUsuarioComponent {

  usuarioList: Usuario[] = [];

  usuarioLogadoObservable: Observable<Usuario | null> = new Observable<Usuario | null>();

  usuarioLogado: Usuario | undefined;

  usuarioSelecionadoList: Usuario[] = [];


  constructor(
    private cdr: ChangeDetectorRef,
    public ref: DynamicDialogRef, // Referência para o diálogo
    public config: DynamicDialogConfig, // Configuração recebida na abertura
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit() {
    this.usuarioLogadoObservable = this.usuarioService.retornaUsuario();
    this.usuarioLogadoObservable.subscribe(usuario => {
      if (usuario) {
        this.usuarioLogado = usuario;
      }
    });

    this.atualizarTabela(true);

  }

  atualizarTabela(consumirAPI: boolean) {
    if(consumirAPI){
      this.usuarioService.buscarTodos().subscribe(instituicaoList => {
        this.usuarioList = instituicaoList.filter(usuario => usuario.id !== this.usuarioLogado?.id);
      });
    }else{
      // Cria uma nova referência para forçar a atualização da tabela
      this.usuarioList = [...this.usuarioList.filter(usuario => usuario.id !== this.usuarioLogado?.id)];
    }
    this.cdr.detectChanges();
  }

  getUsuariosSelecionados() {
    this.ref.close(this.usuarioSelecionadoList);
  }

}
