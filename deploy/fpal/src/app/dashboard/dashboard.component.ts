import {Component, OnInit} from '@angular/core';
import {Params, ActivatedRoute} from '@angular/router';
import {LoginService} from '../services/login.service';
@Component({
  templateUrl: `app/dashboard/dashboard.component.html`,
})
export class DashboardComponent {
  constructor(
    private rt: ActivatedRoute,
    private ls: LoginService
  ) { }

  title: string = 'Bienvenido ' + this.ls.user.nombre + ' ' + this.ls.user.apellido;
  isAlumno: boolean = false;

  ngOnInit() {
    this.isAlumno = this.ls.isTipo('Alumno') ? true : false;
  };
}
