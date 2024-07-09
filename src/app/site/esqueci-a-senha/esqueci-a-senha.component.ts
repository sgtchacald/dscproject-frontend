import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Form, FormControl, FormGroup, Validators} from "@angular/forms";

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
    private route: Router
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

  inserir(){

    console.log(this.form?.value);

    this.isSubmetido = true;

    /*if(
      this.instituicao.nome != null && this.instituicao.nome != "" && this.instituicao.nome != undefined
      && this.instituicao.tipoInstituicao != null && this.instituicao.tipoInstituicao != "" && this.instituicao.tipoInstituicao != undefined
    ){
      this.instituicaoFinanceiraService.cadastrar(this.instituicao).subscribe(
        () => {
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Cadastrado com sucesso.'});
          this.limpaCamposForm();
          this.fecharModal();
        },
        (error) => {
          let erro: string = this.erroService.retornaErroStatusCode(error);
          if(erro != ""){
            this.messageService.add({severity: 'error', summary: 'Erro', detail: erro });
          }
        }
      )
    }*/

  }
}
