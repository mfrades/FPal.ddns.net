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
var ItinerarioService = (function () {
    function ItinerarioService(ls, http) {
        this.ls = ls;
        this.http = http;
    }
    ItinerarioService.prototype.get = function (userId) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.get(this.ls.serverUrl + '/itinerario/' + userId + this.ls.tokenGet)
            .map(function (response) { return response.json(); })
            .catch(this.ls.handleHTTPError);
    };
    ItinerarioService.prototype.set = function (itinerarios, mover) {
        if (mover === void 0) { mover = false; }
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.post(this.ls.serverUrl + '/itinerario' + this.ls.tokenGet + (mover ? '&mover=1' : ''), JSON.stringify(itinerarios), {
            headers: this.ls.headers
        })
            .map(function (response) {
            var itins = response.json();
            for (var i in itinerarios) {
                itinerarios[i] = Object.assign(itinerarios[i], itins[i]);
            }
            return itinerarios;
        })
            .catch(this.ls.handleHTTPError);
    };
    ItinerarioService.prototype.end = function (itinerarioId) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.get(this.ls.serverUrl + '/itinerario/end/' + itinerarioId + this.ls.tokenGet)
            .map(function (response) { return response.json(); })
            .catch(this.ls.handleHTTPError);
    };
    ItinerarioService.prototype.delete = function (itin) {
        if (!this.ls.token) {
            return Rx.Observable.throw('No ha iniciado sesión');
        }
        return this.http.delete(this.ls.serverUrl + '/itinerario/' + itin.itinerarioId + this.ls.tokenGet)
            .catch(this.ls.handleHTTPError);
    };
    return ItinerarioService;
}());
ItinerarioService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        http_1.Http])
], ItinerarioService);
exports.ItinerarioService = ItinerarioService;
//# sourceMappingURL=itinerario.service.js.map