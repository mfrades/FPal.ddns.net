import {Component, Input} from '@angular/core';
import {LoginService} from '../services/login.service';
import {PermisosService} from '../services/permisos.service';


@Component({
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['app/navbar/navbar.css'],
})
export class NavbarComponent {
  constructor(
    private ls: LoginService,
    private perm: PermisosService
  ) { }
  exit() {
    this.ls.logOut();
  }
}
