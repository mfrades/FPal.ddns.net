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
var login_service_1 = require("./services/login.service");
var common_1 = require("@angular/common");
var AppComponent = (function () {
    function AppComponent(ls, lc) {
        this.ls = ls;
        this.lc = lc;
    }
    ;
    AppComponent.prototype.ngOnInit = function () {
        $(document).on('click', '[data-toggle="tooltip"]', function () { return $('div.tooltip').remove(); });
    };
    AppComponent.prototype.onActivate = function (component) {
        this.ls.title = component.title ? component.title : '';
        this.ls.buttons = component.buttons ? component.buttons : [];
    };
    ;
    AppComponent.prototype.onDeactivate = function () {
        this.ls.errors = [];
        this.ls.success = [];
    };
    AppComponent.prototype.cleanErrors = function () {
        this.ls.errors = [];
    };
    AppComponent.prototype.cleanSuccess = function () {
        this.ls.success = [];
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        templateUrl: "app/app.component.html"
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        common_1.Location])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map