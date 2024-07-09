import {NgModule} from "@angular/core";
import {HeaderComponent} from "./layout/header/header.component";
import {MenuComponent} from "./layout/menu/menu.component";
import {FooterComponent} from "./layout/footer/footer.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CommonModule} from "@angular/common";
import {AdminRoutingModule} from "./admin-routing.module";
import {
  NbActionsModule,
  NbCardModule, NbContextMenuModule, NbIconModule,
  NbLayoutModule, NbMenuModule, NbMenuService,
  NbSidebarModule, NbSidebarService,
  NbThemeModule,
  NbUserModule
} from "@nebular/theme";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {LayoutService} from "../../utils/layout.service";
import { InstituicoesFinanceirasComponent } from './financeiro/instituicoes-financeiras/instituicoes-financeiras.component';
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ListboxModule} from "primeng/listbox";
import {RippleModule} from "primeng/ripple";

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    DashboardComponent,
    InstituicoesFinanceirasComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NbThemeModule.forRoot({name: 'default'}),
    NbLayoutModule,
    NbSidebarModule.forRoot(),
    NbCardModule,
    NbActionsModule,
    NbUserModule,
    NbContextMenuModule,
    NbMenuModule.forRoot(),
    NbIconModule,
    NbEvaIconsModule,
    BreadcrumbModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    ListboxModule,
    ReactiveFormsModule,
    RippleModule
  ],
  providers: [
    NbSidebarService,
    NbMenuService,
    LayoutService,
  ],
})
export class AdminModule { }
