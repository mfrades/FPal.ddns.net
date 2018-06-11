import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import * as Rx from "rxjs/Rx";
import { User } from '../models/user';
import { LoginService } from './login.service';
import { PermisosService } from './permisos.service';


@Injectable()
export class UserService {
  constructor(
    private http: Http,
    private ls: LoginService
  ) { }

  save(userId: number, userForm: FormData, editar: boolean): Rx.Observable<Response> {
    if (userId) {
      if (!this.ls.token || !(this.ls.isTipo('Administrador') || this.ls.user.userId === userId)) {
        return Rx.Observable.throw('No tiene permisos para editar Usuarios');
      }
    }

    var THIS = this;
    var method;
    var url = this.ls.serverUrl + '/user';
    if (userId) {
      url += '/' + userId;
    }
    url += this.ls.tokenGet;
    return this.http.post(
      url,
      userForm)
      .catch(this.ls.handleHTTPError);
  };
  get(userId: number): Rx.Observable<User> {

    if (!this.ls.token || !(this.ls.isTipo(['Administrador', 'Formador']) || this.ls.user.userId === userId)) {
      return Rx.Observable.throw('No tiene permisos para acceder a este usuario');
    }
    var THIS = this;
    return this.http.get(this.ls.serverUrl + '/user/' + userId + this.ls.tokenGet)
      .map((response: Response) => response.json() as User)
      .catch(this.ls.handleHTTPError);
  };
  getAll(tipo: string, name: string): Rx.Observable<User[]> {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión.');
    }
    var url = this.ls.serverUrl + '/users';
    var params = new URLSearchParams();
    params.set('token', this.ls.token);
    params.set('tipo', tipo);
    params.set('name', name);

    var THIS = this;
    return this.http.get(url, { search: params })
      .map((response: Response) => response.json() as User[])
      .catch(this.ls.handleHTTPError);
  };
  activar(user: User) {
    if (!user || !user.userId) {
      return Rx.Observable.throw('Identificador erróneo');
    }
    if (!this.ls.token || !this.ls.isTipo(['Administrador'])) {
      return Rx.Observable.throw('No tiene permisos para acceder a este usuario');
    }
    return this.http.get(this.ls.serverUrl + '/user/activar/' + user.userId + this.ls.tokenGet)
      .map(() => user)
      .catch(this.ls.handleHTTPError);
  };

  esFormador(user: User) {
    if (!user || !user.userId) {
      return Rx.Observable.throw('Identificador erróneo');
    }
    if (!this.ls.token || !this.ls.isTipo(['Administrador'])) {
      return Rx.Observable.throw('No tiene permisos para acceder a este usuario');
    }
    return this.http.get(this.ls.serverUrl + '/user/esFormador/' + user.userId + this.ls.tokenGet)
      .map(() => user)
      .catch(this.ls.handleHTTPError);
  };
}
