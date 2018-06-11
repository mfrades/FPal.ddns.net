import {Component, OnInit, ViewChild} from '@angular/core';
import { DataTable } from 'angular2-datatable';
import { Message } from '../models/message';
import {LoginService} from '../services/login.service';
import {MessagesService} from '../services/messages.service';
import { Router } from '@angular/router';
import * as Rx from 'rxjs/Rx';

declare var $: any;

@Component({
  templateUrl: 'app/messages/messages.component.html',
  providers: [MessagesService],
  styleUrls: ['app/messages/messages.css'],
  selector: 'messages'
})
export class MessagesComponent {
  constructor(
    private ls: LoginService,
    private ms: MessagesService,
    private router: Router
  ) { }

  title: string = '';
  messages: Message[] = [];
  enviados: boolean = false;
  @ViewChild(DataTable) dataTable: DataTable;

  ngOnInit() {
    this.enviados = (this.router.url.indexOf('enviados') !== -1 ? true : false);
    this.title = this.enviados ? 'Mensajes Enviados' : 'Mensajes Recibidos';
    this.getMessages();
    this.dataTable
      .onPageChange
      .subscribe(() => $('[data-toggle="tooltip"]').tooltip());
    this.deleterF();
  };

  getMessages() {
    var THIS = this;
    this.ms.getAll(this.enviados)
      .catch((err: any, obs: any) => {
        THIS.ls.handleError(err, obs);
        return Rx.Observable.of([] as Message[])
      })
      .subscribe((messages: Message[]) => {
        THIS.messages = messages;
        setTimeout(() => $('[data-toggle="tooltip"]').tooltip(), 500);
      });

  }
  show(message: Message) {
    if (message.show) {
      message.show = false;
    } else {
      message.show = true;
    }

    if (!message.leido && message.receiverId === this.ls.user.userId) {
      this.ms.leer(message.messageId)
        .catch((err, obs) => { this.ls.handleError(err, obs); return Rx.Observable.of(null); })
        .subscribe(() => message.leido = true);
    }
  }
  deleter = new Rx.Subject();
  deleterF() {
    var THIS = this;
    this.deleter
      .concatMap((message: Message) => this.ms.delete(message))
      .catch((err, obs) => this.ls.handleError(err, obs))
      .subscribe((message: Message) => {
        for (var i in THIS.messages) {
          if (THIS.messages[i].messageId == message.messageId) {
            THIS.messages.splice(parseInt(i), 1);
            break;
          }
        }
      });
  }
  delete(message: Message) {
    this.deleter.next(message);
  }

}
