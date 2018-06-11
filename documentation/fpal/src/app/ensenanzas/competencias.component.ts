import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import * as Rx from 'rxjs/Rx';
import { DataTable } from 'angular2-datatable';
import { LoginService } from '../services/login.service';
import { EnsenanzaService } from '../services/ensenanza.service';
import { Competencia } from '../models/competencia';
declare var $: any;
declare var bf: any;

@Component({
  templateUrl: 'competencias.component.html',
  providers: [EnsenanzaService],
  selector: 'competencias'
})
export class CompetenciasComponent {
  constructor(
    private ls: LoginService,
    private es: EnsenanzaService
  ) { }

  title: string = 'Unidades de Competencia';
  buttons: any[] = [
    {
      title: 'Nueva Unidad de Competencia',
      href: '/competencias/nueva'
    }
  ];
  @Input() competencias: Competencia[] = [];
  @Input() parent: Component = null;
  @ViewChild(DataTable) dataTable: DataTable;
  @Output() deleteEvent: EventEmitter<Competencia> = new EventEmitter();

  ngOnInit() {
    if (!this.parent) {
      this.getCompetencias();
    } else {
      setTimeout(() => $('[data-toggle="tooltip"]').tooltip(), 500);
    }
    this.dataTable
      .onPageChange
      .subscribe(() => $('[data-toggle="tooltip"]').tooltip());
    this.deleterF()
  }

  getCompetencias() {
    this.es.getAllCompetencias()
      .catch((err: any, obs: Rx.Observable<any>) => {
        this.ls.handleError(err, obs);
        return Rx.Observable.of(null);
      })
      .subscribe((competencias: Competencia[]) => {
        this.competencias = competencias;
        setTimeout(() => $('[data-toggle="tooltip"]').tooltip(), 500);
      });
  }

  deleter = new Rx.Subject();
  deleterF() {
    var THIS = this;
    this.deleter
      .concatMap((competencia: Competencia) => this.es.deleteCompetencia(competencia))
      .catch((err, obs) => this.ls.handleError(err, obs))
      .subscribe((competencia: Competencia) => {
        for (var i in THIS.competencias) {
          if (THIS.competencias[i].codigo == competencia.codigo) {
            THIS.competencias.splice(parseInt(i), 1);
            break;
          }
        }
      });
  }
  delete(competencia: Competencia) {
    if (!this.parent) {
      bf.modalQuestion('Borrar Competencia',
        '¿Está seguro de borrar la competencia? Desaparecerá de cualquier cualificación a la que esté asociada'
        , () => {
          this.deleter.next(competencia);
        });
    } else {
      this.deleteEvent.emit(competencia);
    }
  }
}
