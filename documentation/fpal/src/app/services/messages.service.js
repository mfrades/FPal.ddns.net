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
var MessagesService = (function () {
    function MessagesService(ls, http) {
        this.ls = ls;
        this.http = http;
    }
    MessagesService.prototype.getAll = function (enviados) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        var THIS = this;
        return this.http.get(this.ls.serverUrl + '/messages' + (enviados ? '/1' : '') + this.ls.tokenGet)
            .map(function (response) { return response.json(); })
            .catch(this.ls.handleHTTPError);
    };
    ;
    MessagesService.prototype.delete = function (message) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        var THIS = this;
        return this.http.delete(this.ls.serverUrl + '/messages/' + message.messageId + this.ls.tokenGet)
            .map(function () { return message; })
            .catch(this.ls.handleHTTPError);
    };
    ;
    MessagesService.prototype.sendMessage = function (message) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('token', this.ls.token);
        return this.http.post(this.ls.serverUrl + '/messages', JSON.stringify(message), {
            headers: this.ls.headers,
            search: params
        })
            .catch(function (err, obs) { return _this.ls.handleHTTPError(err, obs); });
    };
    ;
    MessagesService.prototype.leer = function (id) {
        var _this = this;
        return this.http.get(this.ls.serverUrl + '/messages/leer/' + id + this.ls.tokenGet)
            .catch(function (err, obs) { return _this.ls.handleHTTPError(err, obs); });
    };
    return MessagesService;
}());
MessagesService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        http_1.Http])
], MessagesService);
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map