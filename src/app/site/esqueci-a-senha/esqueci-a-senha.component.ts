import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Form, FormControl, FormGroup, Validators} from "@angular/forms";
import {UsuarioService} from "../../../services/usuario/usuario.service";
import {MessageService} from "primeng/api";
import {ErroService} from "../../../services/utils/erro.service";

@Component({
  selector: 'app-esqueci-a-senha',
  templateUrl: './esqueci-a-senha.component.html',
  styleUrls: ['./esqueci-a-senha.component.scss']
})
export class EsqueciASenhaComponent {
  modalVisivel: boolean = false;
  email: string = "";
  isSubmetido: boolean = false;

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private erroService: ErroService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['exibirModal']) {
        this.modalVisivel = true;
      }
    });
  }

  fecharModal(){
    this.modalVisivel = false;
    this.route.navigate(['/login']);
  }

  recuperarSenha(){
    this.isSubmetido = true;
    let email: any = this.form.value['email'];
    if(this.form.status == 'VALID'){
      this.usuarioService.recuperarSenha(email).subscribe(
        () => {
          this.fecharModal();
          this.messageService.add(
            {
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Caso seu e-mail esteja em nossos registros serão enviadas para você as instruções para recuperação da conta.'
            }
          );
        },
        (error) => {
          let erro: string = this.erroService.retornaErroStatusCode(error);
          if(erro != ""){
            this.messageService.add(
              {
                severity: 'error',
                summary: 'Erro',
                detail: erro
              }
            );
          }
        }
      )
    }

  }
}
