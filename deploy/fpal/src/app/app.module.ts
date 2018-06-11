import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';


import { RoutingModule } from './routing.module';

import { AppComponent } from './app.component';
import { _404Component } from './_404/_404.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginService } from './services/login.service';
import { NavbarComponent } from './navbar/navbar.component';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';
import { PermisosService } from './services/permisos.service';
import { MessagesComponent } from './messages/messages.component';
import { NewMessageComponent } from './messages/new-message.component';
import { SetCompetenciaComponent } from './ensenanzas/set-competencia.component';
import { CompetenciasComponent } from './ensenanzas/competencias.component';
import { SetCualificacionComponent } from './ensenanzas/set-cualificacion.component';
import { CualificacionesComponent } from './ensenanzas/cualificaciones.component';
import { ItinerarioComponent } from './itinerario/itinerario.component';

import { enableProdMode } from '@angular/core';
//ESTO ES SÓLO PARA PRODUCCIÓN
enableProdMode();

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RoutingModule,
    ReactiveFormsModule,
    DataTableModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    NavbarComponent,
    _404Component,
    DashboardComponent,
    LoginComponent,
    UserComponent,
    UsersComponent,
    MessagesComponent,
    NewMessageComponent,
    SetCompetenciaComponent,
    CompetenciasComponent,
    SetCualificacionComponent,
    CualificacionesComponent,
    ItinerarioComponent
  ],
  providers: [
    LoginService,
    PermisosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
