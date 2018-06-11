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
var login_service_1 = require("../services/login.service");
var Rx = require("rxjs/Rx");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var LoginComponent = (function () {
    function LoginComponent(ls, router, fb) {
        this.ls = ls;
        this.router = router;
        this.fb = fb;
        this.formErrorsMess = {
            email: {
                required: 'El email es obligatorio'
            },
            passwd: {
                required: 'La constraseña es obligatoria'
            }
        };
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.createForm();
        this.authenticate();
    };
    LoginComponent.prototype.createForm = function () {
        var _this = this;
        this.loginForm = this.fb.group({
            email: ['', forms_1.Validators.required],
            passwd: ['', forms_1.Validators.required]
        });
        this.loginForm.valueChanges.subscribe(function () { return _this.validateForm(); });
    };
    LoginComponent.prototype.validateForm = function () {
        this.ls.errors = [];
        for (var field in this.formErrorsMess) {
            var control = this.loginForm.get(field);
            if (control && (control.touched || control.dirty) && !control.valid) {
                var messages = this.formErrorsMess[field];
                for (var key in control.errors) {
                    this.ls.errors.push(messages[key]);
                }
            }
        }
    };
    LoginComponent.prototype.authenticate = function () {
        var _this = this;
        var THIS = this;
        Rx.Observable.fromEvent(document.getElementById('loginForm'), 'submit')
            .concatMap(function () { return _this.ls.authenticate(_this.loginForm.value); })
            .catch(function (err, obs) { return _this.ls.handleError(err, obs); })
            .subscribe(function () { return THIS.router.navigate(['dashboard']); });
    };
    ;
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        templateUrl: "app/login/login.component.html",
        styleUrls: ["app/login/login.css"],
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        router_1.Router,
        forms_1.FormBuilder])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map