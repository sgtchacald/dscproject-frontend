import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AuthGuard} from "../../guards/auth-guard";

const routes: Routes = [
  { path: '', component: DashboardComponent,canActivate: [AuthGuard] },
  { path: 'admin',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
