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
var cualificacion_1 = require("../models/cualificacion");
var Rx = require("rxjs/Rx");
var SetCualificacionComponent = (function () {
    function SetCualificacionComponent(fb, ls, es, rt, rtr) {
        this.fb = fb;
        this.ls = ls;
        this.es = es;
        this.rt = rt;
        this.rtr = rtr;
        this.title = 'Nueva Cualificacion Profesional';
        this.buttons = [];
        this.cualificacion = new cualificacion_1.Cualificacion();
        this.editar = false;
        this.ver = false;
        this.niveles = [1, 2, 3, 4, 5];
        this.competencias = [];
        this.selectedCompetencia = null;
        this.familias = [
            'Actividades físicas y deportivas',
            'Administración y gestión',
            'Agraria',
            'Artes gráficas',
            'Artes y artesanías',
            'Comercio y marketing',
            'Edificación y obra civil',
            'Electricidad y electrónica',
            'Energía y agua',
            'Fabricación mecánica',
            'Hostelería y turismo',
            'Imagen personal',
            'Imagen y sonido',
            'Industrias alimentarias',
            'Industrias extractivas',
            'Informática y comunicaciones',
            'Instalación y mantenimiento',
            'Madera, mueble y corcho',
            'Marítimo pesquera',
            'Química',
            'Sanidad',
            'Seguridad y medio ambiente',
            'Servicios socioculturales y a la comunidad',
            'Textil, confección y piel',
            'Transporte y mantenimiento de vehículos',
            'Vidrio y cerámica',
        ];
        this.formErrorsMess = {
            codigo: {
                required: 'El codigo es obligatorio',
                maxlength: 'El tamaño máximo del código son 45 caracteres'
            },
            identificador: {
                required: 'El identificador es obligatorio'
            },
            nivel: {
                required: 'El nivel es obligatorio'
            },
            familia: {
                required: 'La familia es obligatoria'
            },
            nombre: {
                required: 'La denominación es obligatoria',
                maxlength: 'El tamaño máximo del nombre son 255 caracteres'
            },
            descripcion: {
                maxlength: 'El tamaño máximo de la descripción son 2000 caracteres'
            }
        };
        this.setter = new Rx.Subject();
        this.volver = true;
        this.competenciaSelected = null;
    }
    SetCualificacionComponent.prototype.ngOnInit = function () {
        this.editar = (this.rtr.url.indexOf('editar') !== -1);
        this.ver = (this.rtr.url.indexOf('ver') !== -1);
        if (this.editar) {
            this.title = 'Editar Cualificacion Profesional';
        }
        else if (this.ver) {
            this.title = 'Cualificacion Profesional';
            this.buttons = [{
                    title: 'Volver'
                }];
        }
        this.createForm();
        this.getCualificacion();
        this.setCualificacion();
        this.competFinder();
    };
    ;
    SetCualificacionComponent.prototype.getCualificacion = function () {
        var _this = this;
        var THIS = this;
        if (this.editar || this.ver) {
            this.rt.params
                .switchMap(function (params) { return _this.es.getCualificacion(params['id']); })
                .catch(function (err, obs) {
                _this.ls.handleError(err, obs);
                return Rx.Observable.of(new cualificacion_1.Cualificacion());
            })
                .subscribe(function (cualificacion) {
                THIS.cualificacion = Object.assign(THIS.cualificacion, cualificacion);
                THIS.createForm();
            });
        }
    };
    ;
    SetCualificacionComponent.prototype.createForm = function () {
        var _this = this;
        var formObject = {
            codigo: [this.cualificacion.codigo, [forms_1.Validators.required, forms_1.Validators.maxLength(255)]],
            nivel: [{ value: this.cualificacion.nivel, disabled: this.editar }, [forms_1.Validators.required]],
            nombre: [this.cualificacion.nombre, [forms_1.Validators.required, forms_1.Validators.maxLength(255)]],
            familia: [{ value: this.cualificacion.familia, disabled: this.editar }, [forms_1.Validators.required]],
            descripcion: [this.cualificacion.descripcion, [forms_1.Validators.maxLength(2000)]],
            competencia: [this.competencias[0]],
            entorno: [this.cualificacion.entorno, [forms_1.Validators.maxLength(2000)]]
        };
        if (!this.editar) {
            formObject.identificador = [null, [forms_1.Validators.required]];
        }
        this.form = this.fb.group(formObject);
        this.form.valueChanges.subscribe(function () { return _this.validateForm(); });
    };
    ;
    SetCualificacionComponent.prototype.validateForm = function () {
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
    SetCualificacionComponent.prototype.setCualificacion = function () {
        var _this = this;
        if (this.ver) {
            return false;
        }
        $('#cualificacionForm').on('submit', function () { return _this.setter.next(); });
        this.setter
            .map(function () {
            var cualificacion = _this.form.value;
            cualificacion.competencias = _this.cualificacion.competencias;
            delete (cualificacion.competencia);
            return cualificacion;
        })
            .concatMap(function (cualificacion) { return _this.es.setCualificacion(cualificacion); })
            .catch(function (err, obs) { return _this.ls.handleError(err, obs); })
            .subscribe(function () {
            if (_this.volver) {
                _this.ls.handleSuccess('Cualificacion Profesional Guardada');
                setTimeout(function () { return _this.rtr.navigate(['/cualificaciones']); }, 1000);
            }
            else {
                _this.volver = true;
            }
        });
    };
    ;
    SetCualificacionComponent.prototype.getCompetencias = function () {
        var _this = this;
        var THIS = this;
        this.es.getAllCompetencias()
            .catch(function (err, obs) {
            THIS.ls.handleError(err, obs);
            return Rx.Observable.of([]);
        })
            .subscribe(function (competencias) { return _this.competencias = competencias; });
    };
    SetCualificacionComponent.prototype.addCompetencia = function () {
        var competencia = this.competenciaSelected;
        if (competencia && competencia.codigo) {
            this.cualificacion.competencias.push(competencia);
        }
        this.competenciaSelected = null;
        this.competencias = [];
        this.setInputCompet('');
        this.volver = false;
        this.setter.next();
    };
    SetCualificacionComponent.prototype.deleteCompetencia = function (competencia) {
        for (var i in this.cualificacion.competencias) {
            if (this.cualificacion.competencias[i].codigo == competencia.codigo) {
                this.cualificacion.competencias.splice(parseInt(i), 1);
                break;
            }
        }
        this.volver = false;
        this.setter.next();
    };
    SetCualificacionComponent.prototype.competFinder = function () {
        var _this = this;
        var THIS = this;
        Rx.Observable
            .fromEvent(document.getElementById('competBuscador'), 'keyup')
            .debounceTime(500)
            .distinctUntilChanged()
            .map(function (event) {
            THIS.competencias = [];
            THIS.competenciaSelected = null;
            return event;
        })
            .switchMap(function (event) { return _this.es.getAllCompetencias(event.target.value); })
            .catch(function (err, obs) {
            return THIS.ls.handleError(err, obs);
        })
            .subscribe(function (competencias) {
            var add;
            for (var _i = 0, competencias_1 = competencias; _i < competencias_1.length; _i++) {
                var i = competencias_1[_i];
                add = true;
                for (var _a = 0, _b = _this.cualificacion.competencias; _a < _b.length; _a++) {
                    var j = _b[_a];
                    if (i.codigo == j.codigo) {
                        add = false;
                    }
                }
                if (add) {
                    _this.competencias.push(i);
                }
            }
        });
    };
    ;
    SetCualificacionComponent.prototype.selectCompetencia = function (compet) {
        this.competenciaSelected = compet;
        this.competencias = [];
        this.setInputCompet(compet.nombre);
    };
    SetCualificacionComponent.prototype.setInputCompet = function (value) {
        var input = document.getElementById('competBuscador');
        input.value = value;
    };
    SetCualificacionComponent.prototype.comprobarCodigo = function () {
        var _this = this;
        if (this.editar) {
            return;
        }
        var id = this.form.get('identificador').value, familia = this.form.get('familia').value, nivel = this.form.get('nivel').value, codigoText = document.getElementById('codigoTotal'), codigoForm = this.form.get('codigo');
        if (!id || !familia || !nivel) {
            return false;
        }
        this.es.checkIdCualificacion(id, familia, nivel)
            .delay(500)
            .toPromise()
            .catch(function (err) { return _this.ls.handleError(err, null); })
            .then(function (codigo) {
            codigoText.innerHTML = codigo;
            codigoForm.setValue(codigo);
            if (!codigo) {
                _this.ls.handleError('Ya existe una cualificacion con ese código', null);
            }
        });
    };
    return SetCualificacionComponent;
}());
SetCualificacionComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/ensenanzas/set-cualificacion.component.html',
        providers: [ensenanza_service_1.EnsenanzaService],
        styleUrls: ['app/ensenanzas/set-cualificacion.css'],
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        login_service_1.LoginService,
        ensenanza_service_1.EnsenanzaService,
        router_1.ActivatedRoute,
        router_1.Router])
], SetCualificacionComponent);
exports.SetCualificacionComponent = SetCualificacionComponent;
//# sourceMappingURL=set-cualificacion.component.js.map