"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var angular2_datatable_1 = require("angular2-datatable");
var routing_module_1 = require("./routing.module");
var app_component_1 = require("./app.component");
var _404_component_1 = require("./_404/_404.component");
var login_component_1 = require("./login/login.component");
var dashboard_component_1 = require("./dashboard/dashboard.component");
var login_service_1 = require("./services/login.service");
var navbar_component_1 = require("./navbar/navbar.component");
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
//ESTO ES SÓLO PARA PRODUCCIÓN
// enableProdMode();
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            http_1.HttpModule,
            routing_module_1.RoutingModule,
            forms_1.ReactiveFormsModule,
            angular2_datatable_1.DataTableModule,
            forms_1.FormsModule
        ],
        declarations: [
            app_component_1.AppComponent,
            navbar_component_1.NavbarComponent,
            _404_component_1._404Component,
            dashboard_component_1.DashboardComponent,
            login_component_1.LoginComponent,
            user_component_1.UserComponent,
            users_component_1.UsersComponent,
            messages_component_1.MessagesComponent,
            new_message_component_1.NewMessageComponent,
            set_competencia_component_1.SetCompetenciaComponent,
            competencias_component_1.CompetenciasComponent,
            set_cualificacion_component_1.SetCualificacionComponent,
            cualificaciones_component_1.CualificacionesComponent,
            itinerario_component_1.ItinerarioComponent
        ],
        providers: [
            login_service_1.LoginService,
            permisos_service_1.PermisosService
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map