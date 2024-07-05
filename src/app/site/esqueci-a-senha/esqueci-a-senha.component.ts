import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-esqueci-a-senha',
  templateUrl: './esqueci-a-senha.component.html',
  styleUrls: ['./esqueci-a-senha.component.scss']
})
export class EsqueciASenhaComponent {
  modalVisivel: boolean = false;

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
}
