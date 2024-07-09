import { Component } from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  breadcrumbItens: MenuItem[] | undefined;

  ngOnInit() {
    this.breadcrumbItens = [
      {  icon: 'pi pi-home', routerLink: '/admin' },
      {  label: 'Dashboard' }
    ];
  }
}
