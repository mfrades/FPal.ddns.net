import {Component, OnInit, ViewChild} from '@angular/core';
import * as Rx from 'rxjs/Rx';
import { DataTable } from 'angular2-datatable';
import { LoginService } from '../services/login.service';
import { EnsenanzaService } from '../services/ensenanza.service';
import { Competencia } from '../models/competencia';
import { Cualificacion } from '../models/cualificacion';
declare var $: any;
declare var bf: any;

@Component({
  templateUrl: 'app/ensenanzas/cualificaciones.component.html',
  providers: [EnsenanzaService]
})
export class CualificacionesComponent {
  constructor(
    private ls: LoginService,
    private es: EnsenanzaService
  ) { }

  title: string = 'Cualificaciones Profesionales';
  buttons: any[] = [
    {
      title: 'Nueva Cualificación Profesional',
      href: '/cualificaciones/nueva'
    }
  ];
  cualificaciones: Cualificacion[] = [];
  @ViewChild(DataTable) dataTable: DataTable;

  ngOnInit() {
    this.getCualificaciones();
    this.dataTable
      .onPageChange
      .subscribe(() => $('[data-toggle="tooltip"]').tooltip());
    this.deleterF()

  };

  getCualificaciones() {
    this.es.getAllCualificaciones()
      .catch((err: any, obs: Rx.Observable<any>) => {
        this.ls.handleError(err, obs);
        return Rx.Observable.of(null)
      })
      .subscribe((cualificaciones: Cualificacion[]) => {
        this.cualificaciones = cualificaciones;
        setTimeout(() => $('[data-toggle="tooltip"]').tooltip(), 500);
      });
  };

  deleter = new Rx.Subject();
  deleterF() {
    var THIS = this;
    this.deleter
      .concatMap((cualificacion: Cualificacion) => this.es.deleteCualificacion(cualificacion))
      .catch((err, obs) => this.ls.handleError(err, obs))
      .subscribe((cualificacion: Cualificacion) => {
        for (var i in THIS.cualificaciones) {
          if (THIS.cualificaciones[i].codigo == cualificacion.codigo) {
            THIS.cualificaciones.splice(parseInt(i), 1);
            break;
          }
        }
      });
  }
  delete(cualificacion: Cualificacion) {
    bf.modalQuestion('Borrar Competencia',
      '¿Está seguro de borrar la cualicación? Desaparecerá de cualquier itinerario al que esté asociada'
      , () => {
        this.deleter.next(cualificacion);
      });

  }
}
