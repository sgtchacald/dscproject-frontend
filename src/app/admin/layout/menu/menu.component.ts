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
      link:'/admin',
    },
    {
      title: 'Financeiro',
      icon: 'credit-card-outline',
      children: [
        {
          title:'Instituição Financeira',
          icon: 'briefcase',
          children: [
            {
              title:'Manter',
              icon: 'chevron-right-outline',
              link:'/admin/financeiro/instituicao-financeira',
            },
            {
              title:'Vincular ao Usuário',
              icon: 'sync',
              link:'/admin/financeiro/instituicao-financeira-usuario',
            }
          ],
        },
        {
          title:'Receita',
          icon: 'trending-up',
          link:'/admin/financeiro/receita',
        },
        {
          title:'Despesa',
          icon: 'trending-down',
          link:'/admin/financeiro/despesa'
        },

        {
          title:'Importações',
          icon: 'cloud-upload-outline',
            children: [
              {
                title:'Despesas Cartão',
                icon: 'chevron-right-outline',
                link:'/admin/financeiro/despesa/importar'
              },
              {
                title:'T. Bancária',
                icon: 'chevron-right-outline',
                link:'/admin/financeiro/transacoes-bancarias/importar',
              }
            ]
        },
      ],
    },
  ];
}
