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
var http_1 = require("@angular/http");
var Rx = require("rxjs/Rx");
var login_service_1 = require("./login.service");
var UserService = (function () {
    function UserService(http, ls) {
        this.http = http;
        this.ls = ls;
    }
    UserService.prototype.save = function (userId, userForm, editar) {
        if (userId) {
            if (!this.ls.token || !(this.ls.isTipo('Administrador') || this.ls.user.userId === userId)) {
                return Rx.Observable.throw('No tiene permisos para editar Usuarios');
            }
        }
        var THIS = this;
        var method;
        var url = this.ls.serverUrl + '/user';
        if (userId) {
            url += '/' + userId;
        }
        url += this.ls.tokenGet;
        return this.http.post(url, userForm)
            .catch(this.ls.handleHTTPError);
    };
    ;
    UserService.prototype.get = function (userId) {
        if (!this.ls.token || !(this.ls.isTipo(['Administrador', 'Formador']) || this.ls.user.userId === userId)) {
            return Rx.Observable.throw('No tiene permisos para acceder a este usuario');
        }
        var THIS = this;
        return this.http.get(this.ls.serverUrl + '/user/' + userId + this.ls.tokenGet)
            .map(function (response) { return response.json(); })
            .catch(this.ls.handleHTTPError);
    };
    ;
    UserService.prototype.getAll = function (tipo, name) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión.');
        }
        var url = this.ls.serverUrl + '/users';
        var params = new http_1.URLSearchParams();
        params.set('token', this.ls.token);
        params.set('tipo', tipo);
        params.set('name', name);
        var THIS = this;
        return this.http.get(url, { search: params })
            .map(function (response) { return response.json(); })
            .catch(this.ls.handleHTTPError);
    };
    ;
    UserService.prototype.activar = function (user) {
        if (!user || !user.userId) {
            return Rx.Observable.throw('Identificador erróneo');
        }
        if (!this.ls.token || !this.ls.isTipo(['Administrador'])) {
            return Rx.Observable.throw('No tiene permisos para acceder a este usuario');
        }
        return this.http.get(this.ls.serverUrl + '/user/activar/' + user.userId + this.ls.tokenGet)
            .map(function () { return user; })
            .catch(this.ls.handleHTTPError);
    };
    ;
    UserService.prototype.esFormador = function (user) {
        if (!user || !user.userId) {
            return Rx.Observable.throw('Identificador erróneo');
        }
        if (!this.ls.token || !this.ls.isTipo(['Administrador'])) {
            return Rx.Observable.throw('No tiene permisos para acceder a este usuario');
        }
        return this.http.get(this.ls.serverUrl + '/user/esFormador/' + user.userId + this.ls.tokenGet)
            .map(function () { return user; })
            .catch(this.ls.handleHTTPError);
    };
    ;
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        login_service_1.LoginService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map