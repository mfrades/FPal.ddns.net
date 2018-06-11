import {Injectable} from '@angular/core';
import {LoginService} from './login.service';
import {Headers, Http, Response, URLSearchParams} from '@angular/http';
import {Cualificacion} from '../models/cualificacion';
import {Itinerario} from '../models/itinerario';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class ItinerarioService {
  constructor(
    private ls: LoginService,
    private http: Http,
  ) { }

  get(userId: number) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    return this.http.get(this.ls.serverUrl + '/itinerario/' + userId + this.ls.tokenGet)
      .map((response: Response): Itinerario[] => response.json())
      .catch(this.ls.handleHTTPError);
  }

  set(itinerarios: Itinerario[], mover: boolean = false) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    return this.http.post(this.ls.serverUrl + '/itinerario' + this.ls.tokenGet + (mover ? '&mover=1' : ''),
      JSON.stringify(itinerarios), {
        headers: this.ls.headers
      })
      .map((response: Response) => {
        let itins = response.json();
        for (var i in itinerarios) {
          itinerarios[i] = Object.assign(itinerarios[i], itins[i]);
        }
        return itinerarios;
      })
      .catch(this.ls.handleHTTPError);
  }

  end(itinerarioId: number) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    return this.http.get(this.ls.serverUrl + '/itinerario/end/' + itinerarioId + this.ls.tokenGet)

      .map((response: Response) => response.json())
      .catch(this.ls.handleHTTPError);
  }

  delete(itin: Itinerario) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    return this.http.delete(this.ls.serverUrl + '/itinerario/' + itin.itinerarioId + this.ls.tokenGet)
      .catch(this.ls.handleHTTPError);
  }

}
