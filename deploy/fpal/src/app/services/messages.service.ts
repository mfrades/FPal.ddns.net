import {Injectable} from '@angular/core';
import {LoginService} from './login.service';
import {Headers, Http, Response, URLSearchParams} from '@angular/http';
import {Message} from '../models/message';
import * as Rx from 'rxjs/Rx';


@Injectable()
export class MessagesService {
  constructor(
    private ls: LoginService,
    private http: Http,
  ) { }
  leer(id: number) {
    return this.http.get(this.ls.serverUrl + '/messages/leer/' + id + this.ls.tokenGet)
      .catch((err, obs) => this.ls.handleHTTPError(err, obs));
  };
  getAll(enviados: boolean) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    var THIS = this;
    return this.http.get(this.ls.serverUrl + '/messages' + (enviados ? '/1' : '') + this.ls.tokenGet)
      .map((response: Response) => response.json() as Message[])
      .catch(this.ls.handleHTTPError);
  };

  delete(message: Message) {
    if (!this.ls.token) {
      return Rx.Observable.throw('No ha iniciado sesión');
    }
    var THIS = this;
    return this.http.delete(this.ls.serverUrl + '/messages/' + message.messageId + this.ls.tokenGet)
      .map(() => message)
      .catch(this.ls.handleHTTPError);
  };

  sendMessage(message: Message) {
    var params = new URLSearchParams();
    params.set('token', this.ls.token);
    return this.http.post(this.ls.serverUrl + '/messages',
      JSON.stringify(message),
      {
        headers: this.ls.headers,
        search: params
      })
      .catch((err, obs) => this.ls.handleHTTPError(err, obs));
  };

 

}
