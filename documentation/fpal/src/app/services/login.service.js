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
var router_1 = require("@angular/router");
var LoginService = (function () {
    function LoginService(router, http) {
        this.router = router;
        this.http = http;
        this._token = null;
        this.tokenGet = '';
        this.cleanerIDe = null;
        this.cleanerIDs = null;
        this.errors = [];
        this.success = [];
        this.user = null;
        this.title = '';
        this.serverUrl = 'http://fpal-serv.ddns.net';
        this.noLogRoutes = [
            '/login',
            '/usuario/nuevo'
        ];
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
    }
    Object.defineProperty(LoginService.prototype, "token", {
        get: function () {
            return this._token;
        },
        set: function (token) {
            if (token) {
                this._token = token;
                this.tokenGet = '?token=' + token;
            }
            else {
                this._token = null;
                this.tokenGet = '';
            }
        },
        enumerable: true,
        configurable: true
    });
    LoginService.prototype.handleError = function (err, obs) {
        var _this = this;
        if (this.cleanerIDe) {
            clearTimeout(this.cleanerIDe);
        }
        if (typeof err === 'string') {
            this.errors = [err];
        }
        else if (Array.isArray(err)) {
            this.errors = err;
        }
        this.cleanerIDe = setTimeout(function () { return _this.errors = []; }, 10000);
        window.scroll(0, 0);
        console.log(this.errors);
        return obs;
    };
    ;
    LoginService.prototype.handleHTTPError = function (err, obs) {
        if (typeof err._body === 'string') {
            try {
                return Rx.Observable.throw(JSON.parse(err._body));
            }
            catch (err) {
            }
        }
        return Rx.Observable.throw('Ha sucedido un error desconocido. Compruebe su conexión a internet.');
    };
    ;
    LoginService.prototype.handleSuccess = function (success) {
        var _this = this;
        if (this.cleanerIDs) {
            clearTimeout(this.cleanerIDs);
        }
        if (typeof success === 'string') {
            this.success = [success];
        }
        else if (Array.isArray(success)) {
            this.success = success;
        }
        this.cleanerIDs = setTimeout(function () { return _this.success = []; }, 10000);
        window.scroll(0, 0);
    };
    LoginService.prototype.canActivate = function (activatedRoute, routerState) {
        var futureRoute = routerState.url, notLogin = this.noLogRoutes.indexOf(futureRoute) === -1 ? true : false;
        if (this.token) {
            return notLogin;
        }
        var THIS = this, token = localStorage.getItem('token');
        if (!token) {
            THIS.logOut(futureRoute);
            return !notLogin;
        }
        return this.http.get(this.serverUrl + '/autoLogin?token=' + token)
            .toPromise()
            .then(function (response) {
            THIS.logIn(response, futureRoute);
            return notLogin;
        })
            .catch(function (err) {
            THIS.logOut(futureRoute);
            return !notLogin;
        });
    };
    LoginService.prototype.authenticate = function (user) {
        var THIS = this;
        return this.http.post(this.serverUrl + '/login', JSON.stringify(user), { headers: THIS.headers })
            .map(function (response) { return THIS.logIn(response); })
            .catch(this.handleHTTPError);
    };
    LoginService.prototype.logIn = function (response, route) {
        if (route === void 0) { route = null; }
        if (!route) {
            route = this.router.url;
        }
        var res = response.json();
        this.token = res.token;
        this.user = res.user;
        localStorage.setItem('token', res.token);
        if (this.noLogRoutes.indexOf(route) !== -1) {
            this.router.navigate(['dashboard']);
        }
        return res.user;
    };
    LoginService.prototype.logOut = function (route) {
        if (route === void 0) { route = null; }
        if (!route) {
            route = this.router.url;
        }
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        if (this.noLogRoutes.indexOf(route) === -1) {
            this.router.navigate(['login']);
        }
        return true;
    };
    LoginService.prototype.isTipo = function (tipo, user) {
        if (user === void 0) { user = null; }
        if (!user) {
            user = this.user;
        }
        if (!user || !user.tipo) {
            return false;
        }
        if (typeof tipo === 'string') {
            tipo = [tipo];
        }
        if (!Array.isArray(tipo)) {
            return false;
        }
        var find = false;
        for (var i in tipo) {
            if (user.tipo.indexOf(tipo[i]) !== -1) {
                find = true;
            }
        }
        return find;
    };
    return LoginService;
}());
LoginService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router,
        http_1.Http])
], LoginService);
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map