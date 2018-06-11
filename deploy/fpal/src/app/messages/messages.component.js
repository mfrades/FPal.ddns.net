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
var angular2_datatable_1 = require("angular2-datatable");
var login_service_1 = require("../services/login.service");
var messages_service_1 = require("../services/messages.service");
var router_1 = require("@angular/router");
var Rx = require("rxjs/Rx");
var MessagesComponent = (function () {
    function MessagesComponent(ls, ms, router) {
        this.ls = ls;
        this.ms = ms;
        this.router = router;
        this.title = '';
        this.messages = [];
        this.enviados = false;
        this.deleter = new Rx.Subject();
    }
    MessagesComponent.prototype.ngOnInit = function () {
        this.enviados = (this.router.url.indexOf('enviados') !== -1 ? true : false);
        this.title = this.enviados ? 'Mensajes Enviados' : 'Mensajes Recibidos';
        this.getMessages();
        this.dataTable
            .onPageChange
            .subscribe(function () { return $('[data-toggle="tooltip"]').tooltip(); });
        this.deleterF();
    };
    ;
    MessagesComponent.prototype.getMessages = function () {
        var THIS = this;
        this.ms.getAll(this.enviados)
            .catch(function (err, obs) {
            THIS.ls.handleError(err, obs);
            return Rx.Observable.of([]);
        })
            .subscribe(function (messages) {
            THIS.messages = messages;
            setTimeout(function () { return $('[data-toggle="tooltip"]').tooltip(); }, 500);
        });
    };
    MessagesComponent.prototype.show = function (message) {
        var _this = this;
        if (message.show) {
            message.show = false;
        }
        else {
            message.show = true;
        }
        if (!message.leido && message.receiverId === this.ls.user.userId) {
            this.ms.leer(message.messageId)
                .catch(function (err, obs) { _this.ls.handleError(err, obs); return Rx.Observable.of(null); })
                .subscribe(function () { return message.leido = true; });
        }
    };
    MessagesComponent.prototype.deleterF = function () {
        var _this = this;
        var THIS = this;
        this.deleter
            .concatMap(function (message) { return _this.ms.delete(message); })
            .catch(function (err, obs) { return _this.ls.handleError(err, obs); })
            .subscribe(function (message) {
            for (var i in THIS.messages) {
                if (THIS.messages[i].messageId == message.messageId) {
                    THIS.messages.splice(parseInt(i), 1);
                    break;
                }
            }
        });
    };
    MessagesComponent.prototype.delete = function (message) {
        this.deleter.next(message);
    };
    return MessagesComponent;
}());
__decorate([
    core_1.ViewChild(angular2_datatable_1.DataTable),
    __metadata("design:type", angular2_datatable_1.DataTable)
], MessagesComponent.prototype, "dataTable", void 0);
MessagesComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/messages/messages.component.html',
        providers: [messages_service_1.MessagesService],
        styleUrls: ['app/messages/messages.css'],
        selector: 'messages'
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        messages_service_1.MessagesService,
        router_1.Router])
], MessagesComponent);
exports.MessagesComponent = MessagesComponent;
//# sourceMappingURL=messages.component.js.map