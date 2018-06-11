import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import * as Rx from 'rxjs/Rx';

import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';

declare var bf: any;

@Component({
  templateUrl: 'app/user/user.component.html',
  providers: [UserService]
})
export class UserComponent implements OnInit {
  constructor(
    private ls: LoginService,
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private lc: Location
  ) {
    this.editar = (this.router.url.indexOf('editar') !== -1);
    if (this.editar) this.title = "Editar Usuario";
    this.soloVer = this.editar && !this.ls.isTipo('Administrador');
  };
  title: string = "Nuevo Usuario";
  user: User = new User();
  editar: boolean;
  isAlumno = true;
  userTypes = ['Formador', 'Alumno'];
  form: FormGroup;
  soloVer: boolean;

  ngOnInit() {
    this.createForm();
    this.getUser();
    this.saveUser();
  };
  getUser() {
    var THIS = this;
    if (this.editar) {
      this.route.params
        .switchMap((params: Params) => this.userService.get(params['id']))
        .catch((err, obs) => {
          this.ls.handleError(err, obs);
          return Rx.Observable.of(new User());
        })
        .subscribe((user: User) => {
          THIS.user = Object.assign(THIS.user, user);
          THIS.createForm(true);
          THIS.validateForm();
        });
    }
  };

  createForm(noPass = false) {
    var formObject = {
      email: [this.user.email, [Validators.email]],
      passwd: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,20}$')]],
      repasswd: [''],
      foto: [this.user.foto],
      nombre: [this.user.nombre, [Validators.required, Validators.maxLength(255)]],
      apellido: [this.user.apellido, [Validators.required, Validators.maxLength(255)]],
      formacion: [this.user.formacion, Validators.maxLength(3000)],
      intereses: [this.user.intereses, Validators.maxLength(3000)],
      perspectivas: [this.user.perspectivas, Validators.maxLength(3000)]
    };
    if (noPass) {
      formObject.passwd = ['', [Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,20}$')]];
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
        if (field === 'repasswd' && control.value !== this.form.get('passwd').value) {
          this.ls.errors.push('Las contraseñas no son idénticas');
        }
      }
    }

    this.isAlumno = true;

  };
  saveUser() {
    if (!this.ls.isTipo('Administrador')) {
      return;
    }
    var THIS = this;
    Rx.Observable
      .fromEvent(document.getElementById('userForm'), 'submit')
      .debounceTime(300)
      .switchMap(() => {
        var f = document.getElementById('userForm') as HTMLFormElement;
        var userForm = new FormData(f);
        userForm.append('userId', THIS.user.userId);
        userForm.append('foto', THIS.user.foto);
        return THIS.userService.save(THIS.user.userId, userForm, THIS.editar)
      })
      .catch((err, obs) => this.ls.handleError(err, obs))
      .subscribe(function() {
        if (THIS.editar) {
          THIS.ls.handleSuccess('El usuario se ha Modificado con éxito.');
        } else {
          THIS.ls.handleSuccess(['El usuario se ha creado con éxito.',
            'Debe esperar a que un administrador le dé de alta.']);
        }
        setTimeout(() => THIS.volver(), 1000);
      });
  };
  fotoChange(event: any) {
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
    reader.onload = function(e: any) {
      console.log(e);
      THIS.user.foto = reader.result;
    };
    console.log(file);
    reader.readAsDataURL(file);

  };
  borrarImg() {
    if (this.user) {
      this.user.foto = null;
    }
  };
  formErrorsMess = {
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
  volver() {
    this.router.navigate(['/dashboard']);
  }
}
