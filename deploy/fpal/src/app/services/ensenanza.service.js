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
var login_service_1 = require("./login.service");
var http_1 = require("@angular/http");
var Rx = require("rxjs/Rx");
var EnsenanzaService = (function () {
    function EnsenanzaService(ls, http) {
        this.ls = ls;
        this.http = http;
    }
    EnsenanzaService.prototype.getCompetencia = function (id) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.get(this.ls.serverUrl + '/competencia/' + id + this.ls.tokenGet)
            .map(function (response) { return response.json(); })
            .catch(this.ls.handleHTTPError);
    };
    ;
    EnsenanzaService.prototype.getCualificacion = function (id) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.get(this.ls.serverUrl + '/cualificacion/' + id + this.ls.tokenGet)
            .map(function (response) { return response.json(); })
            .catch(this.ls.handleHTTPError);
    };
    ;
    EnsenanzaService.prototype.setCompetencia = function (competencia) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.post(this.ls.serverUrl + '/competencia' + (competencia.codigo ? '/' + competencia.codigo : '') + this.ls.tokenGet, JSON.stringify(competencia), {
            headers: this.ls.headers
        })
            .map(function (response) { return response.json(); })
            .catch(this.ls.handleHTTPError);
    };
    EnsenanzaService.prototype.setCualificacion = function (cualificacion) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.post(this.ls.serverUrl + '/cualificacion' + (cualificacion.codigo ? '/' + cualificacion.codigo : '') + this.ls.tokenGet, JSON.stringify(cualificacion), {
            headers: this.ls.headers
        })
            .map(function (response) { return response.json(); })
            .catch(this.ls.handleHTTPError);
    };
    EnsenanzaService.prototype.getAllCompetencias = function (nombre) {
        if (nombre === void 0) { nombre = null; }
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.get(this.ls.serverUrl + '/competencias' + this.ls.tokenGet + (nombre ? '&nombre=' + nombre : ''))
            .map(function (response) { return response.json(); })
            .catch(this.ls.handleHTTPError);
    };
    ;
    EnsenanzaService.prototype.getAllCualificaciones = function () {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.get(this.ls.serverUrl + '/cualificaciones' + this.ls.tokenGet)
            .map(function (response) { return response.json(); })
            .catch(this.ls.handleHTTPError);
    };
    ;
    EnsenanzaService.prototype.deleteCompetencia = function (competencia) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.delete(this.ls.serverUrl + '/competencia/' + competencia.codigo + this.ls.tokenGet)
            .map(function () { return competencia; })
            .catch(this.ls.handleHTTPError);
    };
    EnsenanzaService.prototype.deleteCualificacion = function (cualificacion) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.delete(this.ls.serverUrl + '/cualificacion/' + cualificacion.codigo + this.ls.tokenGet)
            .map(function () { return cualificacion; })
            .catch(this.ls.handleHTTPError);
    };
    EnsenanzaService.prototype.checkIdCualificacion = function (id, familia, nivel) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.get(this.ls.serverUrl + '/cualificacion/checkId' + this.ls.tokenGet + '&id=' + id + '&familia=' + familia + '&nivel=' + nivel)
            .map(function (response) { return response.json(); })
            .catch(this.ls.handleHTTPError);
    };
    EnsenanzaService.prototype.checkIdCompetencia = function (id, nivel) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.get(this.ls.serverUrl + '/competencia/checkId' + this.ls.tokenGet + '&id=' + id + '&nivel=' + nivel)
            .map(function (response) { return response.json(); })
            .catch(this.ls.handleHTTPError);
    };
    return EnsenanzaService;
}());
EnsenanzaService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        http_1.Http])
], EnsenanzaService);
exports.EnsenanzaService = EnsenanzaService;
//# sourceMappingURL=ensenanza.service.js.map