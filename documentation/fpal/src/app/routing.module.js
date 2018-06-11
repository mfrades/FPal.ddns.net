"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var login_component_1 = require("./login/login.component");
var login_service_1 = require("./services/login.service");
var _404_component_1 = require("./_404/_404.component");
var dashboard_component_1 = require("./dashboard/dashboard.component");
var user_component_1 = require("./user/user.component");
var users_component_1 = require("./users/users.component");
var permisos_service_1 = require("./services/permisos.service");
var messages_component_1 = require("./messages/messages.component");
var new_message_component_1 = require("./messages/new-message.component");
var set_competencia_component_1 = require("./ensenanzas/set-competencia.component");
var competencias_component_1 = require("./ensenanzas/competencias.component");
var set_cualificacion_component_1 = require("./ensenanzas/set-cualificacion.component");
var cualificaciones_component_1 = require("./ensenanzas/cualificaciones.component");
var itinerario_component_1 = require("./itinerario/itinerario.component");
var routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: dashboard_component_1.DashboardComponent, canActivate: [login_service_1.LoginService] },
    { path: 'login', component: login_component_1.LoginComponent, canActivate: [login_service_1.LoginService] },
    { path: 'usuario/nuevo', component: user_component_1.UserComponent, canActivate: [login_service_1.LoginService] },
    { path: 'usuario/editar/:id', component: user_component_1.UserComponent, canActivate: [login_service_1.LoginService, permisos_service_1.PermisosService] },
    { path: 'formadores', component: users_component_1.UsersComponent, canActivate: [login_service_1.LoginService, permisos_service_1.PermisosService] },
    { path: 'alumnos', component: users_component_1.UsersComponent, canActivate: [login_service_1.LoginService, permisos_service_1.PermisosService] },
    { path: 'mensajes/recibidos', component: messages_component_1.MessagesComponent, canActivate: [login_service_1.LoginService] },
    { path: 'mensajes/enviados', component: messages_component_1.MessagesComponent, canActivate: [login_service_1.LoginService] },
    { path: 'mensajes/enviados', component: messages_component_1.MessagesComponent, canActivate: [login_service_1.LoginService] },
    { path: 'mensajes/nuevo', component: new_message_component_1.NewMessageComponent, canActivate: [login_service_1.LoginService] },
    { path: 'competencias/nueva', component: set_competencia_component_1.SetCompetenciaComponent, canActivate: [login_service_1.LoginService, permisos_service_1.PermisosService] },
    { path: 'competencias/editar/:id', component: set_competencia_component_1.SetCompetenciaComponent, canActivate: [login_service_1.LoginService, permisos_service_1.PermisosService] },
    { path: 'competencias/ver/:id', component: set_competencia_component_1.SetCompetenciaComponent, canActivate: [login_service_1.LoginService] },
    { path: 'competencias', component: competencias_component_1.CompetenciasComponent, canActivate: [login_service_1.LoginService, permisos_service_1.PermisosService] },
    { path: 'cualificaciones/nueva', component: set_cualificacion_component_1.SetCualificacionComponent, canActivate: [login_service_1.LoginService, permisos_service_1.PermisosService] },
    { path: 'cualificaciones/editar/:id', component: set_cualificacion_component_1.SetCualificacionComponent, canActivate: [login_service_1.LoginService, permisos_service_1.PermisosService] },
    { path: 'cualificaciones/ver/:id', component: set_cualificacion_component_1.SetCualificacionComponent, canActivate: [login_service_1.LoginService] },
    { path: 'cualificaciones', component: cualificaciones_component_1.CualificacionesComponent, canActivate: [login_service_1.LoginService, permisos_service_1.PermisosService] },
    { path: 'itinerario/:userid', component: itinerario_component_1.ItinerarioComponent, canActivate: [login_service_1.LoginService] },
    { path: '**', component: _404_component_1._404Component }
];
var RoutingModule = (function () {
    function RoutingModule() {
    }
    return RoutingModule;
}());
RoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    })
], RoutingModule);
exports.RoutingModule = RoutingModule;
//# sourceMappingURL=routing.module.js.map