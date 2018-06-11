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
var CompetenciasComponent = (function () {
    function CompetenciasComponent(ls, es) {
        this.ls = ls;
        this.es = es;
        this.title = 'Unidades de Competencia';
        this.buttons = [
            {
                title: 'Nueva Unidad de Competencia',
                href: '/competencias/nueva'
            }
        ];
        this.competencias = [];
        this.parent = null;
        this.deleteEvent = new core_1.EventEmitter();
        this.deleter = new Rx.Subject();
    }
    CompetenciasComponent.prototype.ngOnInit = function () {
        if (!this.parent) {
            this.getCompetencias();
        }
        else {
            setTimeout(function () { return $('[data-toggle="tooltip"]').tooltip(); }, 500);
        }
        this.dataTable
            .onPageChange
            .subscribe(function () { return $('[data-toggle="tooltip"]').tooltip(); });
        this.deleterF();
    };
    CompetenciasComponent.prototype.getCompetencias = function () {
        var _this = this;
        this.es.getAllCompetencias()
            .catch(function (err, obs) {
            _this.ls.handleError(err, obs);
            return Rx.Observable.of(null);
        })
            .subscribe(function (competencias) {
            _this.competencias = competencias;
            setTimeout(function () { return $('[data-toggle="tooltip"]').tooltip(); }, 500);
        });
    };
    CompetenciasComponent.prototype.deleterF = function () {
        var _this = this;
        var THIS = this;
        this.deleter
            .concatMap(function (competencia) { return _this.es.deleteCompetencia(competencia); })
            .catch(function (err, obs) { return _this.ls.handleError(err, obs); })
            .subscribe(function (competencia) {
            for (var i in THIS.competencias) {
                if (THIS.competencias[i].codigo == competencia.codigo) {
                    THIS.competencias.splice(parseInt(i), 1);
                    break;
                }
            }
        });
    };
    CompetenciasComponent.prototype.delete = function (competencia) {
        var _this = this;
        if (!this.parent) {
            bf.modalQuestion('Borrar Competencia', '¿Está seguro de borrar la competencia? Desaparecerá de cualquier cualificación a la que esté asociada', function () {
                _this.deleter.next(competencia);
            });
        }
        else {
            this.deleteEvent.emit(competencia);
        }
    };
    return CompetenciasComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], CompetenciasComponent.prototype, "competencias", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", core_1.Component)
], CompetenciasComponent.prototype, "parent", void 0);
__decorate([
    core_1.ViewChild(angular2_datatable_1.DataTable),
    __metadata("design:type", angular2_datatable_1.DataTable)
], CompetenciasComponent.prototype, "dataTable", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], CompetenciasComponent.prototype, "deleteEvent", void 0);
CompetenciasComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/ensenanzas/competencias.component.html',
        providers: [ensenanza_service_1.EnsenanzaService],
        selector: 'competencias'
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        ensenanza_service_1.EnsenanzaService])
], CompetenciasComponent);
exports.CompetenciasComponent = CompetenciasComponent;
//# sourceMappingURL=competencias.component.js.map