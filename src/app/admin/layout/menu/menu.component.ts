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
          title:'Instituições Financeiras',
          icon: 'briefcase',
          children: [
            {
              title:'Manter',
              icon: 'plus-square-outline',
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
          title:'Transações Bancárias',
          icon: 'expand-outline',
          children: [
            {
              title:'Importar Extratos',
              icon: 'cloud-upload-outline',
              link:'/admin/financeiro/transacoes-bancarias/importar',
            }
          ],
        },
        {
          title:'Receita',
          icon: 'trending-up',
          children: [
            {
              title:'Manter',
              icon: 'plus-outline',
              link:'/admin/financeiro/receita'
            }
          ]
        },
        {
          title:'Despesa',
          icon: 'trending-down',
          children: [
            {
              title:'Manter',
              icon: 'plus-outline',
              link:'/admin/financeiro/despesa',
            },
            {
              title:'Importar do Cartão',
              icon: 'cloud-upload-outline',
              link:'/admin/financeiro/despesa/importar'
            }
          ]
        },
      ],
    },
  ];
}
