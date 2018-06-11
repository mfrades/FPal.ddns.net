import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class PermisosService implements CanActivate {

  constructor(
    private ls: LoginService
  ) { }

  canActivate(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
    var futureRoute = routerState.url;
    return this.checkAccess(futureRoute);
  };

  permisos: Array<any> = [
    { route: /^\/formadores$/, roles: ['Administrador'] },
    { route: /^\/alumnos$/, roles: ['Administrador', 'Formador'] },
    { route: /^\/usuario\/editar\/\d+$/, roles: ['Administrador', 'Formador'] },
    { route: /^\/competencias\/nueva/, roles: ['Administrador', 'Formador'] },
    { route: /^\/competencias\/editar\/.+$/, roles: ['Administrador', 'Formador'] },
    { route: /^\/competencias$/, roles: ['Administrador', 'Formador'] },
    { route: /^\/cualificaciones\/nueva/, roles: ['Administrador', 'Formador'] },
    { route: /^\/cualificaciones\/editar\/.+$/, roles: ['Administrador', 'Formador'] },
    { route: /^\/cualificaciones$/, roles: ['Administrador', 'Formador'] },
  ];

  canAccess(routes: any) {
    if (typeof routes === 'string') {
      routes = [routes];
    }
    if (!this.ls.user) {
      return false;
    }
    for (var route of routes) {
      for (var permiso of this.permisos) {
        if (permiso.route.test(route)) {
          var roles = this.intersect(permiso.roles, this.ls.user.tipo);
          if (roles.length) {
            return true;
          }
          break;
        }
      }
    }
    return false;
  }

  checkAccess(routes: any) {
    let THIS = this;
    return new Promise((resolve, reject) => {
      let cont = 0;
      let interval = setInterval(() => {
        if (cont >= 2000) {
          resolve(false);
          return;
        }
        if (THIS.ls.user.tipo) {
          resolve(THIS.canAccess(routes));
        }
      }, 250);
    });
  };

  intersect(a: Array<any>, b: Array<any>): Array<any> {
    var t;
    if (b.length > a.length) t = b, b = a, a = t;
    return a.filter(function(e) {
      return b.indexOf(e) > -1;
    });
  }
}
