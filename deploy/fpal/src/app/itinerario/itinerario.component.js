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
var router_1 = require("@angular/router");
var login_service_1 = require("../services/login.service");
var user_service_1 = require("../services/user.service");
var itinerario_service_1 = require("../services/itinerario.service");
var ensenanza_service_1 = require("../services/ensenanza.service");
var itinerario_1 = require("../models/itinerario");
var user_1 = require("../models/user");
var Rx = require("rxjs/Rx");
var ItinerarioComponent = (function () {
    function ItinerarioComponent(ls, rt, us, es, is) {
        this.ls = ls;
        this.rt = rt;
        this.us = us;
        this.es = es;
        this.is = is;
        this.userId = null;
        this.title = 'Itinerario';
        this.user = new user_1.User();
        this.itinerarios = [];
        this.cualificaciones = [];
        this.cualificacion = null;
        this.canEdit = false;
        this.isAlumno = false;
    }
    ItinerarioComponent.prototype.ngOnInit = function () {
        this.getAlumno();
        this.getItinerarios();
        this.getCualificaciones();
        this.canEdit = this.ls.isTipo(['Administrador', 'Formador']) ? true : false;
        this.isAlumno = this.ls.isTipo('Alumno') ? true : false;
    };
    ;
    ItinerarioComponent.prototype.getAlumno = function () {
        var _this = this;
        this.rt.params
            .switchMap(function (params) {
            if (!_this.userId) {
                _this.userId = params['userid'];
            }
            return _this.us.get(_this.userId);
        })
            .catch(function (err, obs) {
            _this.ls.handleError(err, obs);
            return Rx.Observable.of(new user_1.User());
        })
            .subscribe(function (user) {
            _this.user = user;
            _this.title = 'Itinerario de ' + user.nombre + ' ' + user.apellido;
            _this.ls.title = _this.title;
            if (_this.isAlumno && _this.ls.user.userId != _this.userId) {
                _this.isAlumno = false;
            }
        });
    };
    ItinerarioComponent.prototype.getItinerarios = function () {
        var _this = this;
        this.rt.params
            .switchMap(function (params) {
            if (!_this.userId) {
                _this.userId = params['userid'];
            }
            return _this.is.get(_this.userId);
        })
            .catch(function (err, obs) {
            _this.ls.handleError(err, obs);
            return Rx.Observable.of([]);
        })
            .subscribe(function (itinerarios) {
            _this.itinerarios = itinerarios;
            _this.ordenar();
        });
    };
    ;
    ItinerarioComponent.prototype.getCualificaciones = function () {
        var _this = this;
        this.es.getAllCualificaciones()
            .catch(function (err, obs) {
            _this.ls.handleError(err, obs);
            return Rx.Observable.of([]);
        })
            .subscribe(function (cualificaciones) { return _this.cualificaciones = cualificaciones; });
    };
    ItinerarioComponent.prototype.addItinerario = function () {
        var _this = this;
        var cualif = this.cualificacion;
        if (!cualif) {
            return false;
        }
        var orden = 1;
        for (var _i = 0, _a = this.itinerarios; _i < _a.length; _i++) {
            itin = _a[_i];
            if (itin.cualificacion == cualif.codigo) {
                this.ls.handleError('La Cualificacion Profesional ya está añadida', null);
                return false;
            }
            if (itin.orden >= orden)
                orden = itin.orden + 1;
        }
        var itin = new itinerario_1.Itinerario();
        itin.orden = orden;
        itin.userId = this.user.userId;
        itin.cualificacion = cualif.codigo;
        itin.cualificacionO = cualif;
        this.is.set([itin])
            .catch(function (err, obs) {
            _this.ls.handleError(err, obs);
            return Rx.Observable.of([]);
        })
            .subscribe(function (itinerarios) {
            for (var i in itinerarios) {
                _this.itinerarios.push(itinerarios[i]);
            }
            _this.ordenar();
        });
    };
    ItinerarioComponent.prototype.ordenar = function () {
        this.itinerarios.sort(function (a, b) {
            if (a.terminada && !b.terminada) {
                return 1;
            }
            else if (!a.terminada && b.terminada) {
                return -1;
            }
            if (a.terminada) {
            }
            else {
                if (a.orden > b.orden) {
                    return 1;
                }
                else if (a.orden < b.orden) {
                    return -1;
                }
                else if (a.fechaAdd > b.fechaAdd) {
                    return 1;
                }
                else if (a.fechaAdd < b.fechaFin) {
                    return -1;
                }
            }
            return 0;
        });
    };
    ItinerarioComponent.prototype.delete = function (itin) {
        var _this = this;
        this.is.delete(itin)
            .catch(function (err, obs) {
            _this.ls.handleError(err, obs);
            return Rx.Observable.of(null);
        })
            .subscribe(function () {
            for (var i in _this.itinerarios) {
                if (_this.itinerarios[i].itinerarioId == itin.itinerarioId) {
                    _this.itinerarios.splice(parseInt(i), 1);
                }
            }
        });
    };
    ItinerarioComponent.prototype.end = function (itin) {
        var _this = this;
        var THIS = this;
        this.is.end(itin.itinerarioId)
            .catch(function (err, obs) {
            _this.ls.handleError(err, obs);
            return Rx.Observable.of(null);
        })
            .subscribe(function (itins) {
            var itinerario = itins[0];
            for (var _i = 0, _a = THIS.itinerarios; _i < _a.length; _i++) {
                var itin = _a[_i];
                if (itin.itinerarioId == itinerario.itinerarioId)
                    Object.assign(itin, itinerario);
            }
            _this.ordenar();
        });
    };
    ItinerarioComponent.prototype.mover = function (itinA, arriba) {
        var _this = this;
        var indexA;
        var indexB;
        for (var i in this.itinerarios) {
            if (this.itinerarios[i].itinerarioId == itinA.itinerarioId) {
                indexA = parseInt(i);
                if (indexA == 0) {
                    indexB = arriba ? null : indexA + 1;
                }
                else {
                    indexB = arriba ? indexA - 1 : null;
                }
                break;
            }
        }
        if (indexB === null) {
            return false;
        }
        var itinB = this.itinerarios[indexB];
        if (itinA.terminada || itinB.terminada) {
            return false;
        }
        itinB.orden = [itinA.orden, itinA.orden = itinB.orden][0];
        this.is.set([itinA, itinB], true)
            .catch(function (err, obs) {
            _this.ls.handleError(err, obs);
            return Rx.Observable.of(null);
        })
            .subscribe(function () {
            _this.itinerarios[indexA] = itinA;
            _this.itinerarios[indexB] = itinB;
            _this.ordenar();
        });
    };
    return ItinerarioComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], ItinerarioComponent.prototype, "userId", void 0);
ItinerarioComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/itinerario/itinerario.component.html',
        providers: [user_service_1.UserService, ensenanza_service_1.EnsenanzaService, itinerario_service_1.ItinerarioService],
        selector: 'itinerario'
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        router_1.ActivatedRoute,
        user_service_1.UserService,
        ensenanza_service_1.EnsenanzaService,
        itinerario_service_1.ItinerarioService])
], ItinerarioComponent);
exports.ItinerarioComponent = ItinerarioComponent;
//# sourceMappingURL=itinerario.component.js.map