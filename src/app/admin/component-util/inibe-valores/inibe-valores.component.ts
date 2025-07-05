import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-inibe-valores',
  templateUrl: './inibe-valores.component.html',
  styleUrls: ['./inibe-valores.component.scss']
})
export class InibeValoresComponent {

  @Input() valor: any;

  exibeValor: boolean = false;

  exibirValor(){
    this.exibeValor = !this.exibeValor;
  }

}
