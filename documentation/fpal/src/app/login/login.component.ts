import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { LoginService } from '../services/login.service';
import * as Rx from "rxjs/Rx";
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: `login.component.html`,
  styleUrls: [`app/login/login.css`],
})
export class LoginComponent implements OnInit {
  constructor(
    private ls: LoginService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  public loginForm: FormGroup;

  ngOnInit(): void {
    this.createForm();
    this.authenticate();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      passwd: ['', Validators.required]
    });
    this.loginForm.valueChanges.subscribe(() => this.validateForm());
  }
  validateForm() {
    this.ls.errors = [];
    for (const field in this.formErrorsMess) {
      const control = this.loginForm.get(field);
      if (control && (control.touched || control.dirty) && !control.valid) {
        const messages = this.formErrorsMess[field];
        for (const key in control.errors) {
          this.ls.errors.push(messages[key]);
        }
      }
    }
  }

  authenticate() {
    var THIS = this;
    Rx.Observable.fromEvent(document.getElementById('loginForm'), 'submit')
      .concatMap(() => this.ls.authenticate(this.loginForm.value))
      .catch((err, obs) => this.ls.handleError(err, obs))
      .subscribe(() => THIS.router.navigate(['dashboard']));
  };

  formErrorsMess = {
    email: {
      required: 'El email es obligatorio'
    },
    passwd: {
      required: 'La constraseña es obligatoria'
    }
  };
}
