"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var Rx = require("rxjs/Rx");
var angular2_datatable_1 = require("angular2-datatable");
var login_service_1 = require("../services/login.service");
var ensenanza_service_1 = require("../services/ensenanza.service");
var CualificacionesComponent = (function () {
    function CualificacionesComponent(ls, es) {
        this.ls = ls;
        this.es = es;
        this.title = 'Cualificaciones Profesionales';
        this.buttons = [
            {
                title: 'Nueva Cualificación Profesional',
                href: '/cualificaciones/nueva'
            }
        ];
        this.cualificaciones = [];
        this.deleter = new Rx.Subject();
    }
    CualificacionesComponent.prototype.ngOnInit = function () {
        this.getCualificaciones();
        this.dataTable
            .onPageChange
            .subscribe(function () { return $('[data-toggle="tooltip"]').tooltip(); });
        this.deleterF();
    };
    ;
    CualificacionesComponent.prototype.getCualificaciones = function () {
        var _this = this;
        this.es.getAllCualificaciones()
            .catch(function (err, obs) {
            _this.ls.handleError(err, obs);
            return Rx.Observable.of(null);
        })
            .subscribe(function (cualificaciones) {
            _this.cualificaciones = cualificaciones;
            setTimeout(function () { return $('[data-toggle="tooltip"]').tooltip(); }, 500);
        });
    };
    ;
    CualificacionesComponent.prototype.deleterF = function () {
        var _this = this;
        var THIS = this;
        this.deleter
            .concatMap(function (cualificacion) { return _this.es.deleteCualificacion(cualificacion); })
            .catch(function (err, obs) { return _this.ls.handleError(err, obs); })
            .subscribe(function (cualificacion) {
            for (var i in THIS.cualificaciones) {
                if (THIS.cualificaciones[i].codigo == cualificacion.codigo) {
                    THIS.cualificaciones.splice(parseInt(i), 1);
                    break;
                }
            }
        });
    };
    CualificacionesComponent.prototype.delete = function (cualificacion) {
        var _this = this;
        bf.modalQuestion('Borrar Competencia', '¿Está seguro de borrar la cualicación? Desaparecerá de cualquier itinerario al que esté asociada', function () {
            _this.deleter.next(cualificacion);
        });
    };
    return CualificacionesComponent;
}());
__decorate([
    core_1.ViewChild(angular2_datatable_1.DataTable),
    __metadata("design:type", angular2_datatable_1.DataTable)
], CualificacionesComponent.prototype, "dataTable", void 0);
CualificacionesComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/ensenanzas/cualificaciones.component.html',
        providers: [ensenanza_service_1.EnsenanzaService]
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        ensenanza_service_1.EnsenanzaService])
], CualificacionesComponent);
exports.CualificacionesComponent = CualificacionesComponent;
//# sourceMappingURL=cualificaciones.component.js.map