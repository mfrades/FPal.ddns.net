import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';
import { ItinerarioService } from '../services/itinerario.service';
import { EnsenanzaService } from '../services/ensenanza.service';
import { Cualificacion } from '../models/cualificacion';
import { Itinerario } from '../models/itinerario';
import { User } from '../models/user';

import * as Rx from 'rxjs/Rx';
declare var $: any;

@Component({
  templateUrl: 'app/itinerario/itinerario.component.html',
  providers: [UserService, EnsenanzaService, ItinerarioService],
  selector: 'itinerario'
})
export class ItinerarioComponent {
  constructor(
    private ls: LoginService,
    private rt: ActivatedRoute,
    private us: UserService,
    private es: EnsenanzaService,
    private is: ItinerarioService
  ) { }

  @Input() userId: number = null;
  title: string = 'Itinerario';
  user: User = new User();
  itinerarios: Itinerario[] = [];
  cualificaciones: Cualificacion[] = [];
  cualificacion: Cualificacion = null;
  canEdit: boolean = false;
  isAlumno: boolean = false;

  ngOnInit() {
    this.getAlumno();
    this.getItinerarios();
    this.getCualificaciones();
    this.canEdit = this.ls.isTipo(['Administrador', 'Formador']) ? true : false;
    this.isAlumno = this.ls.isTipo('Alumno') ? true : false;
  };

  getAlumno() {

    this.rt.params
      .switchMap((params: Params) => {
        if (!this.userId) {
          this.userId = params['userid'];
        }
        return this.us.get(this.userId);
      })
      .catch((err, obs) => {
        this.ls.handleError(err, obs);
        return Rx.Observable.of(new User());
      })
      .subscribe((user: User) => {
        this.user = user;
        this.title = 'Itinerario de ' + user.nombre + ' ' + user.apellido;
        this.ls.title = this.title;
        if (this.isAlumno && this.ls.user.userId != this.userId) {
          this.isAlumno = false;
        }
      });
  }

  getItinerarios() {
    this.rt.params
      .switchMap((params: Params) => {
        if (!this.userId) {
          this.userId = params['userid'];
        }
        return this.is.get(this.userId);
      })
      .catch((err, obs) => {
        this.ls.handleError(err, obs);
        return Rx.Observable.of([]);
      })
      .subscribe((itinerarios: Itinerario[]) => {
        this.itinerarios = itinerarios;
        this.ordenar()
      });
  };

  getCualificaciones() {
    this.es.getAllCualificaciones()
      .catch((err, obs) => {
        this.ls.handleError(err, obs);
        return Rx.Observable.of([]);
      })
      .subscribe((cualificaciones: Cualificacion[]) => this.cualificaciones = cualificaciones);
  }

  addItinerario() {
    var cualif = this.cualificacion;
    if (!cualif) {
      return false;
    }
    var orden = 1;
    for (itin of this.itinerarios) {
      if (itin.cualificacion == cualif.codigo) {
        this.ls.handleError('La Cualificacion Profesional ya está añadida', null);
        return false;
      }
      if (itin.orden >= orden) orden = itin.orden + 1;
    }
    var itin = new Itinerario();
    itin.orden = orden;
    itin.userId = this.user.userId;
    itin.cualificacion = cualif.codigo;
    itin.cualificacionO = cualif;
    this.is.set([itin])
      .catch((err, obs) => {
        this.ls.handleError(err, obs);
        return Rx.Observable.of([]);
      })
      .subscribe((itinerarios: Itinerario[]) => {
        for (var i in itinerarios) {
          this.itinerarios.push(itinerarios[i]);
        }
        this.ordenar();
      });
  }

  ordenar() {
    this.itinerarios.sort((a, b) => {
      if (a.terminada && !b.terminada) {
        return 1;
      } else if (!a.terminada && b.terminada) {
        return -1;
      }
      if (a.terminada) {

      } else {
        if (a.orden > b.orden) {
          return 1;
        } else if (a.orden < b.orden) {
          return -1;
        } else if (a.fechaAdd > b.fechaAdd) {
          return 1;
        } else if (a.fechaAdd < b.fechaFin) {
          return -1;
        }
      }
      return 0;
    });
  }

  delete(itin: Itinerario) {
    this.is.delete(itin)
      .catch((err, obs) => {
        this.ls.handleError(err, obs);
        return Rx.Observable.of(null);
      })
      .subscribe(() => {
        for (var i in this.itinerarios) {
          if (this.itinerarios[i].itinerarioId == itin.itinerarioId) {
            this.itinerarios.splice(parseInt(i), 1);
          }
        }
      });
  }
  end(itin: Itinerario) {
    var THIS = this;
    this.is.end(itin.itinerarioId)
      .catch((err, obs) => {
        this.ls.handleError(err, obs);
        return Rx.Observable.of(null);
      })
      .subscribe((itins: Itinerario[]) => {
        var itinerario = itins[0];
        for (var itin of THIS.itinerarios) {
          if (itin.itinerarioId == itinerario.itinerarioId) Object.assign(itin, itinerario);
        }
        this.ordenar();
      });
  }
  mover(itinA: Itinerario, arriba: boolean) {
    let indexA: number;
    let indexB: number;
    for (var i in this.itinerarios) {
      if (this.itinerarios[i].itinerarioId == itinA.itinerarioId) {
        indexA = parseInt(i);
        if (indexA == 0) {
          indexB = arriba ? null : indexA + 1;
        } else {
          indexB = arriba ? indexA - 1 : null;
        }
        break;
      }
    }
    if (indexB === null) {
      return false;
    }
    let itinB = this.itinerarios[indexB];
    if (itinA.terminada || itinB.terminada) {
      return false;
    }
    itinB.orden = [itinA.orden, itinA.orden = itinB.orden][0];

    this.is.set([itinA, itinB], true)
      .catch((err, obs) => {
        this.ls.handleError(err, obs);
        return Rx.Observable.of(null);
      })
      .subscribe(() => {
        this.itinerarios[indexA] = itinA;
        this.itinerarios[indexB] = itinB;
        this.ordenar();
      });
  }
}
