import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../services/login.service';
import { EnsenanzaService } from '../services/ensenanza.service';
import { Cualificacion } from '../models/cualificacion';
import { Competencia } from '../models/competencia';
import * as Rx from 'rxjs/Rx';
declare var $: any;

@Component({
  templateUrl: 'app/ensenanzas/set-cualificacion.component.html',
  providers: [EnsenanzaService],
  styleUrls: ['app/ensenanzas/set-cualificacion.css'],
})
export class SetCualificacionComponent {
  constructor(
    private fb: FormBuilder,
    private ls: LoginService,
    private es: EnsenanzaService,
    private rt: ActivatedRoute,
    private rtr: Router
  ) { }

  title: string = 'Nueva Cualificacion Profesional';
  buttons: any[] = [];
  cualificacion: Cualificacion = new Cualificacion();
  form: FormGroup;
  editar: boolean = false;
  ver: boolean = false;


  niveles: Number[] = [1, 2, 3, 4, 5];
  competencias: Competencia[] = [];
  selectedCompetencia: Competencia = null;
  familias: String[] = [
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


  ngOnInit() {
    this.editar = (this.rtr.url.indexOf('editar') !== -1);
    this.ver = (this.rtr.url.indexOf('ver') !== -1);
    if (this.editar) {
      this.title = 'Editar Cualificacion Profesional';
    } else if (this.ver) {
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
  getCualificacion() {
    var THIS = this;
    if (this.editar || this.ver) {

      this.rt.params
        .switchMap((params: Params) => this.es.getCualificacion(params['id']))
        .catch((err, obs) => {
          this.ls.handleError(err, obs);
          return Rx.Observable.of(new Cualificacion());
        })
        .subscribe((cualificacion: Cualificacion) => {
          THIS.cualificacion = Object.assign(THIS.cualificacion, cualificacion);
          THIS.createForm();
        });
    }
  };
  createForm() {
    var formObject: any = {
      codigo: [this.cualificacion.codigo, [Validators.required, Validators.maxLength(255)]],
      nivel: [{ value: this.cualificacion.nivel, disabled: this.editar }, [Validators.required]],
      nombre: [this.cualificacion.nombre, [Validators.required, Validators.maxLength(255)]],
      familia: [{ value: this.cualificacion.familia, disabled: this.editar }, [Validators.required]],
      descripcion: [this.cualificacion.descripcion, [Validators.maxLength(2000)]],
      competencia: [this.competencias[0]],
      entorno: [this.cualificacion.entorno, [Validators.maxLength(2000)]]
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
  setter = new Rx.Subject();
  volver: boolean = true;
  setCualificacion() {
    if (this.ver) {
      return false;
    }
    $('#cualificacionForm').on('submit', () => this.setter.next());

    this.setter
      .map(() => {
        var cualificacion = this.form.value;
        cualificacion.competencias = this.cualificacion.competencias;
        delete (cualificacion.competencia);
        return cualificacion;
      })
      .concatMap((cualificacion) => this.es.setCualificacion(cualificacion))
      .catch((err, obs) => this.ls.handleError(err, obs))
      .subscribe(() => {
        if (this.volver) {
          this.ls.handleSuccess('Cualificacion Profesional Guardada');
          setTimeout(() => this.rtr.navigate(['/cualificaciones']), 1000);
        } else {
          this.volver = true;
        }
      });
  };

  getCompetencias() {
    let THIS = this;
    this.es.getAllCompetencias()
      .catch((err: any, obs: Rx.Observable<any>) => {
        THIS.ls.handleError(err, obs);
        return Rx.Observable.of([]);
      })
      .subscribe((competencias: Competencia[]) => this.competencias = competencias);
  }
  addCompetencia() {
    var competencia = this.competenciaSelected;
    if (competencia && competencia.codigo) {
      this.cualificacion.competencias.push(competencia);
    }
    this.competenciaSelected = null;
    this.competencias = [];
    this.setInputCompet('');
    this.volver = false;
    this.setter.next();

  }
  deleteCompetencia(competencia: Competencia) {
    for (var i in this.cualificacion.competencias) {
      if (this.cualificacion.competencias[i].codigo == competencia.codigo) {
        this.cualificacion.competencias.splice(parseInt(i), 1);
        break;
      }
    }
    this.volver = false;
    this.setter.next();
  }
  competenciaSelected: Competencia = null;
  competFinder() {
    var THIS = this;
    Rx.Observable
      .fromEvent(document.getElementById('competBuscador'), 'keyup')
      .debounceTime(500)
      .distinctUntilChanged()
      .map((event: Event): Event => {
        THIS.competencias = [];
        THIS.competenciaSelected = null;
        return event;
      })
      .switchMap((event: any) => this.es.getAllCompetencias(event.target.value))
      .catch((err, obs) => {
        return THIS.ls.handleError(err, obs);
      })
      .subscribe((competencias: Competencia[]) => {
        var add;
        for (var i of competencias) {
          add = true;
          for (var j of this.cualificacion.competencias) {
            if (i.codigo == j.codigo) {
              add = false;
            }
          }
          if (add) {
            this.competencias.push(i);
          }
        }
      });
  };
  selectCompetencia(compet: Competencia) {
    this.competenciaSelected = compet;
    this.competencias = [];
    this.setInputCompet(compet.nombre);
  }
  setInputCompet(value: string) {
    var input: any = document.getElementById('competBuscador');
    input.value = value;
  }
  comprobarCodigo() {
    if (this.editar) {
      return;
    }
    var id = this.form.get('identificador').value,
      familia = this.form.get('familia').value,
      nivel = this.form.get('nivel').value,
      codigoText: any = document.getElementById('codigoTotal'),
      codigoForm: any = this.form.get('codigo');
    if (!id || !familia || !nivel) {
      return false;
    }
    this.es.checkIdCualificacion(id, familia, nivel)
      .delay(500)
      .toPromise()
      .catch((err) => this.ls.handleError(err, null))
      .then((codigo: string) => {
        codigoText.innerHTML = codigo;
        codigoForm.setValue(codigo);
        if (!codigo) {
          this.ls.handleError('Ya existe una cualificacion con ese código', null);
        }
      });
  }

}
