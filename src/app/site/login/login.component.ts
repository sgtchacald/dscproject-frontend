import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UsuarioService} from "../../../services/usuario/usuario.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {ErroService} from "../../../services/utils/erro.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  @Output() aoLogar = new EventEmitter<any>();

  erro!: string;

  formInvalid: boolean = true;

  formLogin: FormGroup = this.fb.group({
    login: ['', [Validators.required]],
    senha: ['', [Validators.required]]
  });

  loading: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private erroService: ErroService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngAfterViewInit() {
    //Solução de contorno para fazer com que sempre que acesse a tela de login os campos login e senha fiquem limpos

    //Usa o "setTimeout" para garantir que o campo seja preenchido e logo após limpo, não interferindo no autocomplete dos navegadores
    setTimeout(() => {

      //Declara o cssSelector do campo "login", valida a existencia do campo e limpa o campo
      const campoLogin = document.querySelector('#login') as HTMLInputElement;
      if (campoLogin) {
        campoLogin.value = '';
      }

      //Declara o cssSelector do campo "senha" e valida a existência do campo
      const campoSenha = document.querySelector('#senha input') as HTMLInputElement;
      if (campoSenha) {
        //Retira o atributo type
        campoSenha.removeAttribute('type');

        // Limpa o valor do campo
        campoSenha.value = '';

        // Adiciona o atributo 'autocomplete' novamente
        campoSenha.setAttribute('type', 'password');

      }
    }, 1000);
  }

  ngOnInit(): void {
    const bodyElement = document.querySelector('body');
    if(bodyElement != null) {
      bodyElement.classList.add('overflow-hidden');
    }
  }

  onSubmit() {
    this.formInvalid = false;
    if (!this.formLogin.valid) {
      return false;
    } else {
      return console.log(this.formLogin.value);
    }
  }

  get form() {
    return this.formLogin.controls;
  }

  efetuarLogin(){

    let login: any = this.form['login'].value;
    let senha: any = this.form['senha'].value;

    this.usuarioService.autenticar(login, senha).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Login efetuado com sucesso.' });
        this.router.navigate(['/admin'])
      },(error: HttpErrorResponse) => {
        let erro: string = this.erroService.retornaErroStatusCode(error);
        if(erro != null || erro != "" || erro!= undefined){
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

  visible: boolean = false;

  exibirModalEsqueciASenha() {
    this.router.navigate(['login/esqueci-a-senha'], { queryParams: { exibirModal: true } });
  }

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false
    }, 2000);
  }

  cadastrarUsuario() {}
}
