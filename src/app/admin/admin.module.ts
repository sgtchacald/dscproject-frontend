import {APP_INITIALIZER, NgModule} from "@angular/core";
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
import {TableModule} from "primeng/table";
import {ConfirmationService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { InstituicoesFinanceirasUsuarioComponent } from './financeiro/instituicoes-financeiras-usuario/instituicoes-financeiras-usuario.component';
import { RegistrosFinanceirosComponent } from './financeiro/registros-financeiros/registros-financeiros.component';
import {TagModule} from "primeng/tag";
import {SelectButtonModule} from "primeng/selectbutton";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputNumberModule} from "primeng/inputnumber";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/admin/', '.json');
}

const I18N_CONFIG = {
  defaultLanguage: 'pt-br', // this name need to be the same as the JSON file
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient]
  }
}

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    DashboardComponent,
    InstituicoesFinanceirasComponent,
    InstituicoesFinanceirasUsuarioComponent,
    RegistrosFinanceirosComponent,
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
        RippleModule,
        TableModule,
        ConfirmDialogModule,
        HttpClientModule,
        TranslateModule.forRoot(I18N_CONFIG),
        TagModule,
        SelectButtonModule,
        RadioButtonModule,
        InputNumberModule
    ],
  providers: [
    NbSidebarService,
    NbMenuService,
    LayoutService,
    ConfirmationService
  ],
})

export class AdminModule {

}
