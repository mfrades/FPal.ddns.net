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
var login_service_1 = require("../services/login.service");
var ensenanza_service_1 = require("../services/ensenanza.service");
var competencia_1 = require("../models/competencia");
var realizacion_1 = require("../models/realizacion");
var Rx = require("rxjs/Rx");
var SetCompetenciaComponent = (function () {
    function SetCompetenciaComponent(fb, ls, es, rt, rtr) {
        this.fb = fb;
        this.ls = ls;
        this.es = es;
        this.rt = rt;
        this.rtr = rtr;
        this.title = 'Nueva Unidad de Competencia';
        this.buttons = [];
        this.competencia = new competencia_1.Competencia();
        this.editar = false;
        this.ver = false;
        this.niveles = [1, 2, 3, 4, 5];
        this.formErrorsMess = {
            codigo: {
                required: 'El código es obligatorio',
                maxlength: 'El tamaño máximo del código son 255 caracteres'
            },
            identificador: {
                required: 'El identificador es obligatorio'
            },
            nivel: {
                required: 'El nivel es obligatorio'
            },
            nombre: {
                required: 'El código es obligatorio',
                maxlength: 'El tamaño máximo del nombre son 255 caracteres'
            },
            medios: {
                maxlength: 'El tamaño máximo de la descripción son 2000 caracteres'
            },
            productos: {
                maxlength: 'El tamaño máximo de la descripción son 2000 caracteres'
            },
            informacion: {
                maxlength: 'El tamaño máximo de la descripción son 2000 caracteres'
            }
        };
    }
    SetCompetenciaComponent.prototype.ngOnInit = function () {
        this.editar = (this.rtr.url.indexOf('editar') !== -1);
        this.ver = (this.rtr.url.indexOf('ver') !== -1);
        if (this.editar) {
            this.title = 'Editar Unidad de Competencia';
        }
        else if (this.ver) {
            this.title = 'Unidad de Competencia';
            this.buttons = [{
                    title: 'Volver'
                }];
        }
        this.createForm();
        if (this.editar || this.ver) {
            this.getCompetencia();
        }
        this.setCompetencia();
    };
    ;
    SetCompetenciaComponent.prototype.getCompetencia = function () {
        var _this = this;
        if (this.editar || this.ver) {
            var THIS = this;
            this.rt.params
                .switchMap(function (params) { return _this.es.getCompetencia(params['id']); })
                .catch(function (err, obs) {
                _this.ls.handleError(err, obs);
                return Rx.Observable.of(new competencia_1.Competencia());
            })
                .subscribe(function (competencia) {
                THIS.competencia = Object.assign(THIS.competencia, competencia);
                THIS.createForm();
            });
        }
    };
    ;
    SetCompetenciaComponent.prototype.createForm = function () {
        var _this = this;
        var formObject = {
            codigo: [this.competencia.codigo, [forms_1.Validators.required, forms_1.Validators.maxLength(255)]],
            nivel: [{ value: this.competencia.nivel, disabled: this.editar }, [forms_1.Validators.required]],
            nombre: [this.competencia.nombre, [forms_1.Validators.required, forms_1.Validators.maxLength(255)]],
            medios: [this.competencia.medios, [forms_1.Validators.maxLength(2000)]],
            productos: [this.competencia.productos, [forms_1.Validators.maxLength(2000)]],
            informacion: [this.competencia.informacion, [forms_1.Validators.maxLength(2000)]]
        };
        if (!this.editar) {
            formObject.identificador = [null, [forms_1.Validators.required]];
        }
        this.form = this.fb.group(formObject);
        this.form.valueChanges.subscribe(function () { return _this.validateForm(); });
    };
    ;
    SetCompetenciaComponent.prototype.validateForm = function () {
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
    SetCompetenciaComponent.prototype.setCompetencia = function () {
        var _this = this;
        if (this.ver) {
            return false;
        }
        Rx.Observable
            .fromEvent(document.getElementById('competenciaForm'), 'submit')
            .map(function () {
            var compet = _this.form.value;
            compet.realizaciones = _this.competencia.realizaciones;
            return compet;
        })
            .concatMap(function () { return _this.es.setCompetencia(_this.form.value); })
            .catch(function (err, obs) { return _this.ls.handleError(err, obs); })
            .subscribe(function () {
            _this.ls.handleSuccess('Unidad de Competencia Guardada');
            setTimeout(function () { return _this.rtr.navigate(['/competencias']); }, 1000);
        });
    };
    ;
    SetCompetenciaComponent.prototype.comprobarCodigo = function () {
        var _this = this;
        if (this.editar) {
            return;
        }
        var id = this.form.get('identificador').value, nivel = this.form.get('nivel').value, codigoText = document.getElementById('codigoTotal'), codigoForm = this.form.get('codigo');
        if (!id || !nivel) {
            return false;
        }
        this.es.checkIdCompetencia(id, nivel)
            .delay(500)
            .catch(function (err, obs) {
            codigoText.innerHTML = '';
            codigoForm.setValue('');
            _this.ls.handleError(err, obs);
            return Rx.Observable.of(null);
        })
            .subscribe(function (codigo) {
            codigoText.innerHTML = codigo;
            codigoForm.setValue(codigo);
            if (!codigo) {
                _this.ls.handleError('Ya existe una competencia con ese código', null);
            }
        });
    };
    SetCompetenciaComponent.prototype.anadirRealizacion = function () {
        var texto = $('#realizacion').val();
        if (!texto) {
            return false;
        }
        var real = new realizacion_1.Realizacion();
        real.title = texto;
        this.competencia.realizaciones.push(real);
    };
    SetCompetenciaComponent.prototype.anadirCriterio = function (real, e) {
        var texto = $(e.target).closest('div.row').find('textarea').val();
        if (!texto) {
            return false;
        }
        real.criterios.push(texto);
    };
    SetCompetenciaComponent.prototype.deleteRealizacion = function (real) {
        for (var i in this.competencia.realizaciones) {
            if (this.competencia.realizaciones[i] == real) {
                this.competencia.realizaciones.splice(parseInt(i), 1);
                return true;
            }
        }
        return false;
    };
    SetCompetenciaComponent.prototype.deleteCriterio = function (real, crit) {
        for (var i in real.criterios) {
            if (real.criterios[i] == crit) {
                real.criterios.splice(parseInt(i), 1);
                return true;
            }
        }
        return false;
    };
    return SetCompetenciaComponent;
}());
SetCompetenciaComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/ensenanzas/set-competencia.component.html',
        providers: [ensenanza_service_1.EnsenanzaService],
        styleUrls: ['app/ensenanzas/set-competencia.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        login_service_1.LoginService,
        ensenanza_service_1.EnsenanzaService,
        router_1.ActivatedRoute,
        router_1.Router])
], SetCompetenciaComponent);
exports.SetCompetenciaComponent = SetCompetenciaComponent;
//# sourceMappingURL=set-competencia.component.js.map