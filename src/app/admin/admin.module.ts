import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AdminRoutingModule} from "./admin-routing.module";
import {
  NbActionsModule,
  NbCardModule,
  NbContextMenuModule,
  NbIconModule,
  NbLayoutModule, NbMenuModule, NbMenuService,
  NbSidebarModule, NbSidebarService,
  NbThemeModule,
  NbUserModule
} from "@nebular/theme";
import { HeaderComponent } from './header/header.component';
import {MessageService} from "primeng/api";
import {LayoutService} from "../../utils/layout.service";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent
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
    NbMenuModule.forRoot(),
    NbIconModule,
    NbEvaIconsModule
  ],
  providers: [
    NbSidebarService,
    NbMenuService,
    LayoutService,

  ],
})
export class AdminModule { }
