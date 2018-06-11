import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import * as Rx from "rxjs/Rx";


import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../models/user';

@Injectable()
export class LoginService implements CanActivate {
  constructor(
    private router: Router,
    private http: Http
  ) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  private _token: string = null;
  tokenGet: string = '';
  cleanerIDe: any = null;
  cleanerIDs: any = null;
  errors: string[] = [];
  success: string[] = [];
  user: User = null;
  title: string = '';
  buttons: any[];
  headers: Headers;
  serverUrl: string = 'http://fpal-serv.es';
  private noLogRoutes: string[] = [
    '/login',
    '/usuario/nuevo'
  ];

  set token(token: string) {
    if (token) {
      this._token = token;
      this.tokenGet = '?token=' + token;
    } else {
      this._token = null;
      this.tokenGet = '';
    }
  }

  get token(): string {
    return this._token;
  }

  handleError(err: any, obs: Rx.Observable<any>): Rx.Observable<any> {
    if (this.cleanerIDe) {
      clearTimeout(this.cleanerIDe);
    }
    if (typeof err === 'string') {
      this.errors = [err];
    } else if (Array.isArray(err)) {
      this.errors = err;
    }

    this.cleanerIDe = setTimeout(() => this.errors = [], 10000);
    window.scroll(0, 0);
    console.log(this.errors);
    return obs;
  };

  handleHTTPError(err: any, obs: Rx.Observable<any>): Rx.Observable<any> {
    if (typeof err._body === 'string') {
      try {
        return Rx.Observable.throw(JSON.parse(err._body));
      } catch (err) {

      }
    }
    return Rx.Observable.throw('Ha sucedido un error desconocido. Compruebe su conexión a internet.');
  };

  handleSuccess(success: any) {
    if (this.cleanerIDs) {
      clearTimeout(this.cleanerIDs);
    }
    if (typeof success === 'string') {
      this.success = [success];
    } else if (Array.isArray(success)) {
      this.success = success;
    }
    this.cleanerIDs = setTimeout(() => this.success = [], 10000);
    window.scroll(0, 0);
  }

  canActivate(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
    var futureRoute = routerState.url,
      notLogin = this.noLogRoutes.indexOf(futureRoute) === -1 ? true : false;

    if (this.token) {
      return notLogin;
    }

    var THIS = this,
      token = localStorage.getItem('token');

    if (!token) {
      THIS.logOut(futureRoute);
      return !notLogin;
    }
    return this.http.get(this.serverUrl + '/autoLogin?token=' + token)
      .toPromise()
      .then(function(response) {
        THIS.logIn(response, futureRoute);
        return notLogin;
      })
      .catch(function(err) {
        THIS.logOut(futureRoute);
        return !notLogin;
      });
  }

  authenticate(user: User) {
    var THIS = this;
    return this.http.post(
      this.serverUrl + '/login',
      JSON.stringify(user),
      { headers: THIS.headers })
      .map((response) => THIS.logIn(response))
      .catch(this.handleHTTPError);
  }

  logIn(response: Response, route: string = null): User {
    if (!route) {
      route = this.router.url;
    }
    var res = response.json();
    this.token = res.token;
    this.user = res.user;
    localStorage.setItem('token', res.token);
    if (this.noLogRoutes.indexOf(route) !== -1) {

      this.router.navigate(['dashboard']);
    }
    return res.user;
  }

  logOut(route: string = null): boolean {
    if (!route) {
      route = this.router.url;
    }
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    if (this.noLogRoutes.indexOf(route) === -1) {
      this.router.navigate(['login']);
    }
    return true;
  }

  isTipo(tipo: any, user: User = null) {
    if (!user) {
      user = this.user;
    }
    if (!user || !user.tipo) {
      return false;
    }
    if (typeof tipo === 'string') {
      tipo = [tipo];
    }
    if (!Array.isArray(tipo)) {
      return false;
    }
    var find = false;

    for (var i in tipo) {
      if (user.tipo.indexOf(tipo[i]) !== -1) {
        find = true;
      }
    }
    return find;
  }
}
