import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UsuarioService} from "../../../services/usuario/usuario.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

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

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder
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

  ngOnInit(): void {}

  onSubmit() {
    this.formInvalid = false;
    if (!this.formLogin.valid) {
      alert('Please fill all the required fields to create a super hero!');
      return false;
    } else {
      return console.log(this.formLogin.value);
    }
  }

  get form() {
    return this.formLogin.controls;
  }

  efetuarLogin(){

    let login: any = this.form['login'];
    let senha: any = this.form['senha'];

    this.usuarioService.autenticar(login, senha).subscribe(
      () => {
        console.log('Login Efetuado com sucesso, redirecionando para rota');
        window.location.href = "/administracao";
      },(error) => {
        const servidorDesconectado = "O servidor está desconectado";
        this.erro = error.status == 504 ? servidorDesconectado : error.error.message;
      }
    )
  }


}
