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
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var Rx = require("rxjs/Rx");
var user_1 = require("../models/user");
var user_service_1 = require("../services/user.service");
var login_service_1 = require("../services/login.service");
var UserComponent = (function () {
    function UserComponent(ls, fb, userService, route, router, lc) {
        this.ls = ls;
        this.fb = fb;
        this.userService = userService;
        this.route = route;
        this.router = router;
        this.lc = lc;
        this.title = "Nuevo Usuario";
        this.user = new user_1.User();
        this.isAlumno = true;
        this.userTypes = ['Formador', 'Alumno'];
        this.formErrorsMess = {
            email: {
                email: 'El email no tiene un formato válido'
            },
            passwd: {
                required: 'La contraseña debe tener una mayúscula, una minúscula, un número y 8-20 caracteres',
                pattern: 'La contraseña debe tener una mayúscula, una minúscula, un número y 8-20 caracteres'
            },
            repasswd: {},
            nombre: {
                required: 'El nombre es obligatorio',
                maxlength: 'El tamaño máximo del nombre es de 255 caracteres'
            },
            apellido: {
                required: 'Los apellidos son obligatorios',
                maxlength: 'El tamaño máximo de los apellidos es de 255 caracteres'
            },
            formacion: {
                maxlength: 'El tamaño máximo de la formación es de 3000 caracteres'
            },
            intereses: {
                maxlength: 'El tamaño máximo de los intereses es de 3000 caracteres'
            },
            perspectivas: {
                maxlength: 'El tamaño máximo de las perspectivas es de 3000 caracteres'
            }
        };
        this.editar = (this.router.url.indexOf('editar') !== -1);
        if (this.editar)
            this.title = "Editar Usuario";
        this.soloVer = this.editar && !this.ls.isTipo('Administrador');
    }
    ;
    UserComponent.prototype.ngOnInit = function () {
        this.createForm();
        this.getUser();
        this.saveUser();
    };
    ;
    UserComponent.prototype.getUser = function () {
        var _this = this;
        var THIS = this;
        if (this.editar) {
            this.route.params
                .switchMap(function (params) { return _this.userService.get(params['id']); })
                .catch(function (err, obs) {
                _this.ls.handleError(err, obs);
                return Rx.Observable.of(new user_1.User());
            })
                .subscribe(function (user) {
                THIS.user = Object.assign(THIS.user, user);
                THIS.createForm(true);
                THIS.validateForm();
            });
        }
    };
    ;
    UserComponent.prototype.createForm = function (noPass) {
        var _this = this;
        if (noPass === void 0) { noPass = false; }
        var formObject = {
            email: [this.user.email, [forms_1.Validators.email]],
            passwd: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,20}$')]],
            repasswd: [''],
            foto: [this.user.foto],
            nombre: [this.user.nombre, [forms_1.Validators.required, forms_1.Validators.maxLength(255)]],
            apellido: [this.user.apellido, [forms_1.Validators.required, forms_1.Validators.maxLength(255)]],
            formacion: [this.user.formacion, forms_1.Validators.maxLength(3000)],
            intereses: [this.user.intereses, forms_1.Validators.maxLength(3000)],
            perspectivas: [this.user.perspectivas, forms_1.Validators.maxLength(3000)]
        };
        if (noPass) {
            formObject.passwd = ['', [forms_1.Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,20}$')]];
        }
        this.form = this.fb.group(formObject);
        this.form.valueChanges.subscribe(function () { return _this.validateForm(); });
    };
    ;
    UserComponent.prototype.validateForm = function () {
        this.ls.errors = [];
        for (var field in this.formErrorsMess) {
            var control = this.form.get(field);
            if (control && (control.touched) && (!control.valid || (field === 'repasswd'))) {
                var messages = this.formErrorsMess[field];
                for (var key in control.errors) {
                    this.ls.errors.push(messages[key]);
                }
                if (field === 'repasswd' && control.value !== this.form.get('passwd').value) {
                    this.ls.errors.push('Las contraseñas no son idénticas');
                }
            }
        }
        this.isAlumno = true;
    };
    ;
    UserComponent.prototype.saveUser = function () {
        var _this = this;
        if (!this.ls.isTipo('Administrador')) {
            return;
        }
        var THIS = this;
        Rx.Observable
            .fromEvent(document.getElementById('userForm'), 'submit')
            .debounceTime(300)
            .switchMap(function () {
            var f = document.getElementById('userForm');
            var userForm = new FormData(f);
            userForm.append('userId', THIS.user.userId);
            userForm.append('foto', THIS.user.foto);
            return THIS.userService.save(THIS.user.userId, userForm, THIS.editar);
        })
            .catch(function (err, obs) { return _this.ls.handleError(err, obs); })
            .subscribe(function () {
            if (THIS.editar) {
                THIS.ls.handleSuccess('El usuario se ha Modificado con éxito.');
            }
            else {
                THIS.ls.handleSuccess(['El usuario se ha creado con éxito.',
                    'Debe esperar a que un administrador le dé de alta.']);
            }
            setTimeout(function () { return THIS.volver(); }, 1000);
        });
    };
    ;
    UserComponent.prototype.fotoChange = function (event) {
        console.log('changing');
        var THIS = this;
        if (!event.target.files || !event.target.files[0]) {
            return false;
        }
        var file = event.target.files[0];
        var error = false;
        if (file.type.indexOf('image') === -1) {
            this.ls.errors.push('La foto de perfil debe ser una imagen.');
            error = true;
        }
        if (file.size > 1048576) {
            this.ls.errors.push('La foto de perfil debe tener un tamaño máximo de 1 mb.');
            error = true;
        }
        if (error) {
            THIS.user.foto = null;
            return false;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            console.log(e);
            THIS.user.foto = reader.result;
        };
        console.log(file);
        reader.readAsDataURL(file);
    };
    ;
    UserComponent.prototype.borrarImg = function () {
        if (this.user) {
            this.user.foto = null;
        }
    };
    ;
    UserComponent.prototype.volver = function () {
        this.router.navigate(['/dashboard']);
    };
    return UserComponent;
}());
UserComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/user/user.component.html',
        providers: [user_service_1.UserService]
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        forms_1.FormBuilder,
        user_service_1.UserService,
        router_1.ActivatedRoute,
        router_1.Router,
        common_1.Location])
], UserComponent);
exports.UserComponent = UserComponent;
//# sourceMappingURL=user.component.js.map