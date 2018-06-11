import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {LoginService} from './services/login.service';
import {_404Component} from './_404/_404.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UserComponent} from './user/user.component';
import {UsersComponent} from './users/users.component';
import {PermisosService} from './services/permisos.service';
import {MessagesComponent} from './messages/messages.component';
import {NewMessageComponent} from './messages/new-message.component';
import {SetCompetenciaComponent} from './ensenanzas/set-competencia.component';
import {CompetenciasComponent} from './ensenanzas/competencias.component';
import {SetCualificacionComponent} from './ensenanzas/set-cualificacion.component';
import {CualificacionesComponent} from './ensenanzas/cualificaciones.component';
import {ItinerarioComponent} from './itinerario/itinerario.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [LoginService] },
  { path: 'login', component: LoginComponent, canActivate: [LoginService] },
  { path: 'usuario/nuevo', component: UserComponent, canActivate: [LoginService] },
  { path: 'usuario/editar/:id', component: UserComponent, canActivate: [LoginService, PermisosService] },
  { path: 'formadores', component: UsersComponent, canActivate: [LoginService, PermisosService] },
  { path: 'alumnos', component: UsersComponent, canActivate: [LoginService, PermisosService] },
  { path: 'mensajes/recibidos', component: MessagesComponent, canActivate: [LoginService] },
  { path: 'mensajes/enviados', component: MessagesComponent, canActivate: [LoginService] },
  { path: 'mensajes/enviados', component: MessagesComponent, canActivate: [LoginService] },
  { path: 'mensajes/nuevo', component: NewMessageComponent, canActivate: [LoginService] },
  { path: 'competencias/nueva', component: SetCompetenciaComponent, canActivate: [LoginService, PermisosService] },
  { path: 'competencias/editar/:id', component: SetCompetenciaComponent, canActivate: [LoginService, PermisosService] },
  { path: 'competencias/ver/:id', component: SetCompetenciaComponent, canActivate: [LoginService] },
  { path: 'competencias', component: CompetenciasComponent, canActivate: [LoginService, PermisosService] },
  { path: 'cualificaciones/nueva', component: SetCualificacionComponent, canActivate: [LoginService, PermisosService] },
  { path: 'cualificaciones/editar/:id', component: SetCualificacionComponent, canActivate: [LoginService, PermisosService] },
  { path: 'cualificaciones/ver/:id', component: SetCualificacionComponent, canActivate: [LoginService] },
  { path: 'cualificaciones', component: CualificacionesComponent, canActivate: [LoginService, PermisosService] },
  { path: 'itinerario/:userid', component: ItinerarioComponent, canActivate: [LoginService] },
  { path: '**', component: _404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class RoutingModule { }
