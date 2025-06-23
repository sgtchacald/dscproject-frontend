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
      children: [
        {
          title:'Instituições Financeiras',
          icon: 'chevron-right-outline',
          children: [
            {
              title:'Manter',
              icon: 'chevron-right-outline',
              link:'/admin/financeiro/instituicao-financeira',
            },
            {
              title:'Vincular ao Usuário',
              icon: 'chevron-right-outline',
              link:'/admin/financeiro/instituicao-financeira-usuario',
            }
          ],
        },
        {
          title:'Receita',
          icon: 'chevron-right-outline',
          link:'/admin/financeiro/receita',
        },
        {
          title:'Despesa',
          icon: 'chevron-right-outline',
          children: [
            {
              title:'Manter',
              icon: 'chevron-right-outline',
              link:'/admin/financeiro/despesa',
            },
            {
              title:'Importar',
              icon: 'chevron-right-outline',
              link:'/admin/financeiro/despesa/importar'
            }
          ]
        },
      ],
    },
  ];
}
