import { Component, ViewChild, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'my-app',
  templateUrl: `app/app.component.html`
})
export class AppComponent implements OnInit {
  constructor(
    public ls: LoginService,
    public lc: Location
  ) { };

  ngOnInit() {
    $(document).on('click', '[data-toggle="tooltip"]', () => $('div.tooltip').remove());
  }
  onActivate(component: any) {
    this.ls.title = component.title ? component.title : '';
    this.ls.buttons = component.buttons ? component.buttons : [];
  };
  onDeactivate() {
    this.ls.errors = [];
    this.ls.success = [];
  }

  cleanErrors() {
    this.ls.errors = [];
  }

  cleanSuccess() {
    this.ls.success = [];
  }

}
