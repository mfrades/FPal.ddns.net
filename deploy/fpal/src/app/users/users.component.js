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
var Rx = require("rxjs/Rx");
var login_service_1 = require("../services/login.service");
var user_service_1 = require("../services/user.service");
var angular2_datatable_1 = require("angular2-datatable");
var UsersComponent = (function () {
    function UsersComponent(ls, userService, route, router) {
        this.ls = ls;
        this.userService = userService;
        this.route = route;
        this.router = router;
        this.title = "Alumnos";
        this.tipo = null;
        this.activator = new Rx.Subject();
    }
    ;
    UsersComponent.prototype.ngOnInit = function () {
        this.getUsers();
        this.dataTable
            .onPageChange
            .subscribe(function () { return $('[data-toggle="tooltip"]').tooltip(); });
        this.activatorF();
        if (this.router.url === '/formadores') {
            this.title = 'Formadores';
        }
        else {
            this.alumnos = true;
        }
    };
    ;
    UsersComponent.prototype.getUsers = function () {
        var _this = this;
        var THIS = this;
        if (!this.tipo) {
            this.tipo = this.router.url.indexOf('formadores') !== -1 ? 'Formador' : 'Alumno';
        }
        this.userService.getAll(this.tipo, null)
            .catch(function (err, obs) {
            _this.ls.handleError(err, obs);
            return Rx.Observable.of([]);
        })
            .subscribe(function (users) {
            THIS.users = users;
            setTimeout(function () { return $('[data-toggle="tooltip"]').tooltip(); }, 500);
        });
    };
    UsersComponent.prototype.activar = function (user) {
        this.activator.next(user);
    };
    UsersComponent.prototype.activatorF = function () {
        var _this = this;
        this.activator
            .switchMap(function (user) { return _this.userService.activar(user); })
            .catch(function (err, obs) { return _this.ls.handleError(err, obs); })
            .subscribe(function (user) { return user.activo = user.activo ? false : true; });
    };
    UsersComponent.prototype.esFormador = function (user) {
        var _this = this;
        this.userService.esFormador(user)
            .catch(function (err, obs) {
            _this.ls.handleError(err, obs);
            return Rx.Observable.of(null);
        })
            .subscribe(function () {
            for (var i in _this.users) {
                if (_this.users[i] == user) {
                    _this.users.splice(parseInt(i), 1);
                }
            }
        });
    };
    return UsersComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], UsersComponent.prototype, "tipo", void 0);
__decorate([
    core_1.ViewChild(angular2_datatable_1.DataTable),
    __metadata("design:type", angular2_datatable_1.DataTable)
], UsersComponent.prototype, "dataTable", void 0);
UsersComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/users/users.component.html',
        providers: [user_service_1.UserService],
        selector: 'users'
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        user_service_1.UserService,
        router_1.ActivatedRoute,
        router_1.Router])
], UsersComponent);
exports.UsersComponent = UsersComponent;
//# sourceMappingURL=users.component.js.map