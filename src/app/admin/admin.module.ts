import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AdminRoutingModule} from "./admin-routing.module";
import {
  NbActionsModule,
  NbCardModule,
  NbContextMenuModule,
  NbIconModule,
  NbLayoutModule, NbMenuService,
  NbSidebarModule, NbSidebarService,
  NbThemeModule,
  NbUserModule
} from "@nebular/theme";
import { HeaderComponent } from './header/header.component';
import {MessageService} from "primeng/api";
import {LayoutService} from "../../utils/layout.service";
import {NbEvaIconsModule} from "@nebular/eva-icons";

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbSidebarModule.forRoot(),
    NbCardModule,
    NbActionsModule,
    NbUserModule,
    NbContextMenuModule,
    NbIconModule,
    NbEvaIconsModule
  ],
  providers: [
    NbSidebarService,
    NbMenuService,
    LayoutService
  ],
})
export class AdminModule { }
