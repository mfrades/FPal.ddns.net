import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Message } from '../models/message';
import {LoginService} from '../services/login.service';
import {MessagesService} from '../services/messages.service';
import {UserService} from '../services/user.service';
import {Location} from '@angular/common';
import {User} from '../models/user';
import * as Rx from 'rxjs/Rx';

declare var $: any;



@Component({
  templateUrl: 'app/messages/new-message.component.html',
  providers: [MessagesService, UserService],
  styleUrls: ['app/messages/new-message.css'],
})
export class NewMessageComponent {
  constructor(
    private ls: LoginService,
    private ms: MessagesService,
    private fb: FormBuilder,
    private us: UserService,
    private lc: Location
  ) { }

  title: string = 'Nuevo Mensaje';
  message: Message = new Message();
  form: FormGroup;
  users: User[] = [];

  ngOnInit() {
    this.createForm();
    this.userFinder();
    this.sendMessage();
  };

  createForm(noPass = false) {
    var formObject = {
      receiverId: [this.message.receiverId, [Validators.required]],
      receiver: [this.message.receiver, [Validators.required]],
      subject: [this.message.subject, [Validators.required, Validators.maxLength(255)]],
      body: [this.message.subject, [Validators.required, Validators.maxLength(2000)]]
    };
    this.form = this.fb.group(formObject);
    this.form.valueChanges.subscribe(() => this.validateForm());
  };
  validateForm() {
    this.ls.errors = [];
    for (const field in this.formErrorsMess) {
      const control = this.form.get(field);
      if (control && (control.touched) && (!control.valid || (field === 'repasswd'))) {
        const messages = this.formErrorsMess[field];
        for (const key in control.errors) {
          this.ls.errors.push(messages[key]);
        }
      }
    }
  };
  formErrorsMess = {
    receiverId: {
      required: 'El destinatario es obligatorio'
    },
    receiver: {
      required: 'El destinatario es obligatorio'
    },
    subject: {
      required: 'El asunto es obligatorio',
      maxlength: 'El tamaño máximo del asunto es obligatorio'
    },
    body: {
      required: 'Ha dejado el cuerpo del mensaje en blanco',
      maxlength: 'El tamaño máximo del mensaje es de 2000 caracteres'
    }
  };
  userFinder() {
    var THIS = this;
    Rx.Observable
      .fromEvent(document.getElementById('receiver'), 'keyup')
      .debounceTime(500)
      .distinctUntilChanged()
      .map((event: Event): Event => {
        THIS.users = [];
        THIS.form.controls['receiverId'].setValue('');
        return event;
      })
      .switchMap((event: any) => this.us.getAll(null, event.target.value))
      .catch((err, obs) => {
        THIS.users = [];
        return THIS.ls.handleError(err, obs);
      })
      .subscribe((users: User[]) => this.users = users);
  };
  selectReceiver(user: User) {
    this.form.controls['receiverId'].setValue(user.userId);
    this.form.controls['receiver'].setValue(user.nombre + ' ' + user.apellido);
    this.users = [];
  };
  sendMessage() {
    Rx.Observable
      .fromEvent(document.getElementById('messageForm'), 'submit')
      .concatMap(() => this.ms.sendMessage(this.form.value))
      .catch((err, obs) => this.ls.handleError(err, obs))
      .subscribe(() => {
        this.ls.handleSuccess('Mensaje Enviado');
        setTimeout(() => this.lc.back(), 1000);
      });
  };


}
