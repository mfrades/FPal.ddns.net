import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { Cualificacion } from '../models/cualificacion';
import { Competencia } from '../models/competencia';
import * as Rx from 'rxjs/Rx';


@Injectable()
export class EnsenanzaService {
  constructor(
    private ls: LoginService,
    private http: Http,
  ) { }

  getCompetencia(id: number) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    return this.http.get(this.ls.serverUrl + '/competencia/' + id + this.ls.tokenGet)
      .map((response: Response): Competencia => response.json())
      .catch(this.ls.handleHTTPError);
  };

  getCualificacion(id: number) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    return this.http.get(this.ls.serverUrl + '/cualificacion/' + id + this.ls.tokenGet)
      .map((response: Response): Cualificacion => response.json())
      .catch(this.ls.handleHTTPError);
  };

  setCompetencia(competencia: Competencia) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    return this.http.post(this.ls.serverUrl + '/competencia' + (competencia.codigo ? '/' + competencia.codigo : '') + this.ls.tokenGet,
      JSON.stringify(competencia), {
        headers: this.ls.headers
      })
      .map((response: Response): Competencia => response.json())
      .catch(this.ls.handleHTTPError);
  }

  setCualificacion(cualificacion: Cualificacion) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    return this.http.post(this.ls.serverUrl + '/cualificacion' + (cualificacion.codigo ? '/' + cualificacion.codigo : '') + this.ls.tokenGet,
      JSON.stringify(cualificacion), {
        headers: this.ls.headers
      })
      .map((response: Response): Cualificacion => response.json())
      .catch(this.ls.handleHTTPError);
  }

  getAllCompetencias(nombre: string = null) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    return this.http.get(this.ls.serverUrl + '/competencias' + this.ls.tokenGet + (nombre ? '&nombre=' + nombre : ''))
      .map((response: Response): Competencia[] => response.json())
      .catch(this.ls.handleHTTPError);
  };

  getAllCualificaciones() {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    return this.http.get(this.ls.serverUrl + '/cualificaciones' + this.ls.tokenGet)
      .map((response: Response): Cualificacion[] => response.json())
      .catch(this.ls.handleHTTPError);
  };

  deleteCompetencia(competencia: Competencia) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    return this.http.delete(this.ls.serverUrl + '/competencia/' + competencia.codigo + this.ls.tokenGet)
      .map(() => competencia)
      .catch(this.ls.handleHTTPError);
  }

  deleteCualificacion(cualificacion: Cualificacion) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    return this.http.delete(this.ls.serverUrl + '/cualificacion/' + cualificacion.codigo + this.ls.tokenGet)
      .map(() => cualificacion)
      .catch(this.ls.handleHTTPError);
  }

  checkIdCualificacion(id: number, familia: string, nivel: number) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }

    return this.http.get(this.ls.serverUrl + '/cualificacion/checkId' + this.ls.tokenGet + '&id=' + id + '&familia=' + familia + '&nivel=' + nivel)
      .map((response: Response): string => response.json())
      .catch(this.ls.handleHTTPError);
  }
  checkIdCompetencia(id: number, nivel: number) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }

    return this.http.get(this.ls.serverUrl + '/competencia/checkId' + this.ls.tokenGet + '&id=' + id + '&nivel=' + nivel)
      .map((response: Response): string => response.json())
      .catch(this.ls.handleHTTPError);
  }

}
