import { Component } from '@angular/core';
import {NbMenuItem} from "@nebular/theme";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent {
  menuItens: NbMenuItem[] = [
    {
      title: 'Home',
      icon: 'home-outline',
      link:'/administracao',
    },
    {
      title: 'Financeiro',
      icon: 'credit-card-outline',
      expanded: true,
      children: [
        {
          title:'Instituições',
          icon: 'chevron-right-outline',
          link:'/administracao/financeiro/instituicoes-financeiras',
        },
        {
          title:'Lançamentos',
          icon: 'chevron-right-outline',
          link:'',
        },
        {
          title:'Pagamentos',
          icon: 'chevron-right-outline',
          link:'',
        },
      ],
    },
  ];
}
