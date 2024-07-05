import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import {SiteRoutingModule} from "./site-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import {PasswordModule} from "primeng/password";
import {CheckboxModule} from "primeng/checkbox";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {InputTextModule} from "primeng/inputtext";
import {ToastModule} from "primeng/toast";
import {MessageModule} from "primeng/message";
import { EsqueciASenhaComponent } from './esqueci-a-senha/esqueci-a-senha.component';
import {DialogModule} from "primeng/dialog";
import {AvatarModule} from "primeng/avatar";

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    EsqueciASenhaComponent
  ],
  imports: [
    CommonModule,
    SiteRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    ToastModule,
    MessageModule,
    DialogModule,
    AvatarModule
  ]
})
export class SiteModule { }
