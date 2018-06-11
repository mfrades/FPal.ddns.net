import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../services/login.service';
import { EnsenanzaService } from '../services/ensenanza.service';
import { Competencia } from '../models/competencia';
import { Realizacion } from '../models/realizacion';
import * as Rx from 'rxjs/Rx';
declare var $: any;

@Component({
  templateUrl: 'app/ensenanzas/set-competencia.component.html',
  providers: [EnsenanzaService],
  styleUrls: ['app/ensenanzas/set-competencia.css']
})
export class SetCompetenciaComponent {
  constructor(
    private fb: FormBuilder,
    private ls: LoginService,
    private es: EnsenanzaService,
    private rt: ActivatedRoute,
    private rtr: Router
  ) { }

  title: string = 'Nueva Unidad de Competencia';
  buttons: any[] = [];
  competencia: Competencia = new Competencia();
  form: FormGroup;
  editar: boolean = false;
  ver: boolean = false;
  niveles: Number[] = [1, 2, 3, 4, 5];

  ngOnInit() {
    this.editar = (this.rtr.url.indexOf('editar') !== -1);
    this.ver = (this.rtr.url.indexOf('ver') !== -1);
    if (this.editar) {
      this.title = 'Editar Unidad de Competencia';
    } else if (this.ver) {
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

  getCompetencia() {
    if (this.editar || this.ver) {
      var THIS = this;
      this.rt.params
        .switchMap((params: Params) => this.es.getCompetencia(params['id']))
        .catch((err, obs) => {
          this.ls.handleError(err, obs);
          return Rx.Observable.of(new Competencia());
        })
        .subscribe((competencia: Competencia) => {
          THIS.competencia = Object.assign(THIS.competencia, competencia);
          THIS.createForm();
        });
    }
  };

  createForm() {
    var formObject: any = {
      codigo: [this.competencia.codigo, [Validators.required, Validators.maxLength(255)]],
      nivel: [{ value: this.competencia.nivel, disabled: this.editar }, [Validators.required]],
      nombre: [this.competencia.nombre, [Validators.required, Validators.maxLength(255)]],
      medios: [this.competencia.medios, [Validators.maxLength(2000)]],
      productos: [this.competencia.productos, [Validators.maxLength(2000)]],
      informacion: [this.competencia.informacion, [Validators.maxLength(2000)]]
    };
    if (!this.editar) {
      formObject.identificador = [null, [Validators.required]];
    }
    this.form = this.fb.group(formObject);
    this.form.valueChanges.subscribe(() => this.validateForm());
  };
  validateForm() {
    this.ls.errors = [];
    for (const field in this.formErrorsMess) {
      const control = this.form.get(field);
      if (control && (control.touched) && (!control.valid || (field === 'repasswd'))) {
        const messages = this.formErrorsMess[field];
        for (const key in control.errors) {
          this.ls.errors.push(messages[key]);
        }
      }
    }
  };
  formErrorsMess = {
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
  setCompetencia() {
    if (this.ver) {
      return false;
    }

    Rx.Observable
      .fromEvent(document.getElementById('competenciaForm'), 'submit')
      .map(() => {
        var compet = this.form.value;
        compet.realizaciones = this.competencia.realizaciones;
        return compet;
      })
      .concatMap(() => this.es.setCompetencia(this.form.value))
      .catch((err, obs) => this.ls.handleError(err, obs))
      .subscribe(() => {
        this.ls.handleSuccess('Unidad de Competencia Guardada');
        setTimeout(() => this.rtr.navigate(['/competencias']), 1000);
      });
  };
  comprobarCodigo() {
    if (this.editar) {
      return;
    }
    var id = this.form.get('identificador').value,
      nivel = this.form.get('nivel').value,
      codigoText: any = document.getElementById('codigoTotal'),
      codigoForm: any = this.form.get('codigo');
    if (!id || !nivel) {
      return false;
    }
    this.es.checkIdCompetencia(id, nivel)
      .delay(500)
      .catch((err, obs) => {
        codigoText.innerHTML = '';
        codigoForm.setValue('');
        this.ls.handleError(err, obs);
        return Rx.Observable.of(null);
      })
      .subscribe((codigo: string) => {
        codigoText.innerHTML = codigo;
        codigoForm.setValue(codigo);
        if (!codigo) {
          this.ls.handleError('Ya existe una competencia con ese código', null);
        }
      });
  }
  anadirRealizacion() {
    let texto = $('#realizacion').val();
    if (!texto) {
      return false;
    }
    let real = new Realizacion();
    real.title = texto;
    this.competencia.realizaciones.push(real);
  }
  anadirCriterio(real: Realizacion, e: Event) {
    let texto = $(e.target).closest('div.row').find('textarea').val();
    if (!texto) {
      return false;
    }
    real.criterios.push(texto);
  }
  deleteRealizacion(real: Realizacion) {
    for (var i in this.competencia.realizaciones) {
      if (this.competencia.realizaciones[i] == real) {
        this.competencia.realizaciones.splice(parseInt(i), 1);
        return true;
      }
    }
    return false;
  }
  deleteCriterio(real: Realizacion, crit: string) {
    for (var i in real.criterios) {
      if (real.criterios[i] == crit) {
        real.criterios.splice(parseInt(i), 1);
        return true;
      }
    }
    return false;
  }

}
