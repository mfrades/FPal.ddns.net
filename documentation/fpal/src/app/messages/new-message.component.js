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
var message_1 = require("../models/message");
var login_service_1 = require("../services/login.service");
var messages_service_1 = require("../services/messages.service");
var user_service_1 = require("../services/user.service");
var common_1 = require("@angular/common");
var Rx = require("rxjs/Rx");
var NewMessageComponent = (function () {
    function NewMessageComponent(ls, ms, fb, us, lc) {
        this.ls = ls;
        this.ms = ms;
        this.fb = fb;
        this.us = us;
        this.lc = lc;
        this.title = 'Nuevo Mensaje';
        this.message = new message_1.Message();
        this.users = [];
        this.formErrorsMess = {
            receiverId: {
                required: 'El destinatario es obligatorio'
            },
            receiver: {
                required: 'El destinatario es obligatorio'
            },
            subject: {
                required: 'El asunto es obligatorio',
                maxlength: 'El tamaño máximo del asunto es obligatorio'
            },
            body: {
                required: 'Ha dejado el cuerpo del mensaje en blanco',
                maxlength: 'El tamaño máximo del mensaje es de 2000 caracteres'
            }
        };
    }
    NewMessageComponent.prototype.ngOnInit = function () {
        this.createForm();
        this.userFinder();
        this.sendMessage();
    };
    ;
    NewMessageComponent.prototype.createForm = function (noPass) {
        var _this = this;
        if (noPass === void 0) { noPass = false; }
        var formObject = {
            receiverId: [this.message.receiverId, [forms_1.Validators.required]],
            receiver: [this.message.receiver, [forms_1.Validators.required]],
            subject: [this.message.subject, [forms_1.Validators.required, forms_1.Validators.maxLength(255)]],
            body: [this.message.subject, [forms_1.Validators.required, forms_1.Validators.maxLength(2000)]]
        };
        this.form = this.fb.group(formObject);
        this.form.valueChanges.subscribe(function () { return _this.validateForm(); });
    };
    ;
    NewMessageComponent.prototype.validateForm = function () {
        this.ls.errors = [];
        for (var field in this.formErrorsMess) {
            var control = this.form.get(field);
            if (control && (control.touched) && (!control.valid || (field === 'repasswd'))) {
                var messages = this.formErrorsMess[field];
                for (var key in control.errors) {
                    this.ls.errors.push(messages[key]);
                }
            }
        }
    };
    ;
    NewMessageComponent.prototype.userFinder = function () {
        var _this = this;
        var THIS = this;
        Rx.Observable
            .fromEvent(document.getElementById('receiver'), 'keyup')
            .debounceTime(500)
            .distinctUntilChanged()
            .map(function (event) {
            THIS.users = [];
            THIS.form.controls['receiverId'].setValue('');
            return event;
        })
            .switchMap(function (event) { return _this.us.getAll(null, event.target.value); })
            .catch(function (err, obs) {
            THIS.users = [];
            return THIS.ls.handleError(err, obs);
        })
            .subscribe(function (users) { return _this.users = users; });
    };
    ;
    NewMessageComponent.prototype.selectReceiver = function (user) {
        this.form.controls['receiverId'].setValue(user.userId);
        this.form.controls['receiver'].setValue(user.nombre + ' ' + user.apellido);
        this.users = [];
    };
    ;
    NewMessageComponent.prototype.sendMessage = function () {
        var _this = this;
        Rx.Observable
            .fromEvent(document.getElementById('messageForm'), 'submit')
            .concatMap(function () { return _this.ms.sendMessage(_this.form.value); })
            .catch(function (err, obs) { return _this.ls.handleError(err, obs); })
            .subscribe(function () {
            _this.ls.handleSuccess('Mensaje Enviado');
            setTimeout(function () { return _this.lc.back(); }, 1000);
        });
    };
    ;
    return NewMessageComponent;
}());
NewMessageComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/messages/new-message.component.html',
        providers: [messages_service_1.MessagesService, user_service_1.UserService],
        styleUrls: ['app/messages/new-message.css'],
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        messages_service_1.MessagesService,
        forms_1.FormBuilder,
        user_service_1.UserService,
        common_1.Location])
], NewMessageComponent);
exports.NewMessageComponent = NewMessageComponent;
//# sourceMappingURL=new-message.component.js.map