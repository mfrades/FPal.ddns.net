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
var PermisosService = (function () {
    function PermisosService(ls) {
        this.ls = ls;
        this.permisos = [
            { route: /^\/formadores$/, roles: ['Administrador'] },
            { route: /^\/alumnos$/, roles: ['Administrador', 'Formador'] },
            { route: /^\/usuario\/editar\/\d+$/, roles: ['Administrador', 'Formador'] },
            { route: /^\/competencias\/nueva/, roles: ['Administrador', 'Formador'] },
            { route: /^\/competencias\/editar\/.+$/, roles: ['Administrador', 'Formador'] },
            { route: /^\/competencias$/, roles: ['Administrador', 'Formador'] },
            { route: /^\/cualificaciones\/nueva/, roles: ['Administrador', 'Formador'] },
            { route: /^\/cualificaciones\/editar\/.+$/, roles: ['Administrador', 'Formador'] },
            { route: /^\/cualificaciones$/, roles: ['Administrador', 'Formador'] },
        ];
    }
    PermisosService.prototype.canActivate = function (activatedRoute, routerState) {
        var futureRoute = routerState.url;
        return this.checkAccess(futureRoute);
    };
    ;
    PermisosService.prototype.canAccess = function (routes) {
        if (typeof routes === 'string') {
            routes = [routes];
        }
        if (!this.ls.user) {
            return false;
        }
        for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
            var route = routes_1[_i];
            for (var _a = 0, _b = this.permisos; _a < _b.length; _a++) {
                var permiso = _b[_a];
                if (permiso.route.test(route)) {
                    var roles = this.intersect(permiso.roles, this.ls.user.tipo);
                    if (roles.length) {
                        return true;
                    }
                    break;
                }
            }
        }
        return false;
    };
    PermisosService.prototype.checkAccess = function (routes) {
        var THIS = this;
        return new Promise(function (resolve, reject) {
            var cont = 0;
            var interval = setInterval(function () {
                if (cont >= 2000) {
                    resolve(false);
                    return;
                }
                if (THIS.ls.user.tipo) {
                    resolve(THIS.canAccess(routes));
                }
            }, 250);
        });
    };
    ;
    PermisosService.prototype.intersect = function (a, b) {
        var t;
        if (b.length > a.length)
            t = b, b = a, a = t;
        return a.filter(function (e) {
            return b.indexOf(e) > -1;
        });
    };
    return PermisosService;
}());
PermisosService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [login_service_1.LoginService])
], PermisosService);
exports.PermisosService = PermisosService;
//# sourceMappingURL=permisos.service.js.map