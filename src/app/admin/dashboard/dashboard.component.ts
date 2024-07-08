import { Component } from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  breadcrumbItens: MenuItem[] | undefined;

  home: MenuItem | undefined;

  ngOnInit() {
    this.breadcrumbItens = [
      {  label: 'Home', icon: 'pi pi-home', routerLink: '/admin' },
      { label: 'Dashboard' }
    ];
  }
}
