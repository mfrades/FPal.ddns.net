import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Rx from 'rxjs/Rx';

import { LoginService } from '../services/login.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { DataTable } from 'angular2-datatable';

declare var $: any;

@Component({
  templateUrl: 'app/users/users.component.html',
  providers: [UserService],
  selector: 'users'
})
export class UsersComponent implements OnInit {
  constructor(
    private ls: LoginService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { };
  title: string = "Alumnos";
  errors: Array<string>;
  alumnos: boolean;
  users: User[];
  @Input() tipo: string = null;

  @ViewChild(DataTable) dataTable: DataTable;
  ngOnInit() {
    this.getUsers();
    this.dataTable
      .onPageChange
      .subscribe(() => $('[data-toggle="tooltip"]').tooltip());
    this.activatorF();
    if (this.router.url === '/formadores') {
      this.title = 'Formadores';
    } else {
      this.alumnos = true;
    }
  };
  getUsers() {
    var THIS = this;
    if (!this.tipo) {
      this.tipo = this.router.url.indexOf('formadores') !== -1 ? 'Formador' : 'Alumno';
    }
    this.userService.getAll(this.tipo, null)
      .catch((err: any, obs: any) => {
        this.ls.handleError(err, obs);
        return Rx.Observable.of([] as User[]);
      })
      .subscribe((users: User[]) => {
        THIS.users = users;
        setTimeout(() => $('[data-toggle="tooltip"]').tooltip(), 500);
      });
  }
  activar(user: User) {
    this.activator.next(user);
  }
  activator = new Rx.Subject();
  activatorF() {
    this.activator
      .switchMap((user: User) => this.userService.activar(user))
      .catch((err, obs) => this.ls.handleError(err, obs))
      .subscribe((user: User) => user.activo = user.activo ? false : true);
  }
  esFormador(user: User) {
    this.userService.esFormador(user)
      .catch((err, obs) => {
        this.ls.handleError(err, obs);
        return Rx.Observable.of(null);
      })
      .subscribe(() => {
        for (var i in this.users) {
          if (this.users[i] == user) {
            this.users.splice(parseInt(i), 1);
          }
        }
      });
  }

}
